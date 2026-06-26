//
//  NotificationService.swift
//  NotificationServiceExtension
//
//  Created by Rohan on 06/05/24.
//

import UserNotifications
import Foundation

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?
    let extentionBundleIdentifier = Bundle.main.bundleIdentifier
  
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    NSLog("📩 Notification received in service")
    if let bestAttemptContent = bestAttemptContent {
      var updatedTitle: String? = nil
      
      // Extract the number from the payload
      if let aps = request.content.userInfo["aps"] as? [String: Any],
         let data = aps["data"] as? [String: Any] {

        let notificationType = data["notification_type"] as? String
        let incomingNumber = data["number"] as? String ?? data["caller_number"] as? String
        let sipCallerName = data["caller"] as? String

        if let number = incomingNumber {
            // Convert number to E164 format before processing
            let convertedNumber = sendMessageConversionAlgo(number)
            NSLog("🔎 Original number: %@, Converted number: %@", number, convertedNumber)
            
            // Use converted number for contact lookup
            updatedTitle = getContactName(for: convertedNumber)
            
            // If not found in local/remote, and it's a missed call, fallback to SIP name
            if updatedTitle == nil, notificationType == "missed_call_push", let sipName = sipCallerName, !sipName.isEmpty {
                updatedTitle = sipName
                NSLog("📞 Using SIP name as fallback: %@", sipName)
            }
        } else {
            NSLog("⚠️ Failed to parse incoming number or caller_number from payload")
        }

      } else {
          NSLog("⚠️ Failed to parse APS or data from payload")
      }
      
      // Update the title if found
      if let matchedName = updatedTitle {
          // If the notification type is 'missed_call_push', update title and body
          if let aps = request.content.userInfo["aps"] as? [String: Any],
             let data = aps["data"] as? [String: Any] {
              
              let notificationType = data["notification_type"] as? String
              let incomingNumber = data["number"] as? String ?? data["caller_number"] as? String
              
              if notificationType == "missed_call_push" {
                  let titlePrefix = LocalizationHelper.localizedString("_missedCall")
                  bestAttemptContent.title = titlePrefix
                  NSLog("📛 Updated title for missed call: %@", bestAttemptContent.title)
              } else {
                  let smsLabel = LocalizationHelper.localizedString("_smsMessage")
                  bestAttemptContent.title = "\(smsLabel) \(matchedName)"
                  NSLog("✅ Updated title with matched name: %@", bestAttemptContent.title)
              }

              // 🟢 Body update logic
              if notificationType == "missed_call_push" {
                  if let incomingNumber = incomingNumber {
                      // Convert number to E164 format for display
                      let convertedNumber = sendMessageConversionAlgo(incomingNumber)
                      bestAttemptContent.body = "\(matchedName): \(convertedNumber)"
                      NSLog("✅ Updated body for missed call: %@", bestAttemptContent.body)
                  } else {
                      bestAttemptContent.body = "\(matchedName): No number available"
                      NSLog("⚠️ No number available, using fallback body: %@", bestAttemptContent.body)
                  }
              }
          }
      } else {
          NSLog("❌ No matched contact found; keeping original title")
      }
      
      // Badge count logic
      var allwords = extentionBundleIdentifier?.components(separatedBy: ".")
      allwords?.removeLast();
      guard let bundleIdentifier = allwords?.joined(separator: ".") else {
        NSLog("⚠️ Could not determine bundle identifier for App Group")
        contentHandler(bestAttemptContent)
        return
      };
        let suiteName = "group." + bundleIdentifier;
            NSLog("📦 Using suite name: %@", suiteName)
      
            let defaults = UserDefaults(suiteName: suiteName)
            var count = (defaults?.value(forKey: "count") as? Int ?? 0) + 1
            defaults?.set(count, forKey: "count")
            bestAttemptContent.badge = NSNumber(value: count)
            NSLog("🔢 Updated badge count to: %d", count)
            contentHandler(bestAttemptContent)
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        NSLog("⏱ Service extension time will expire")
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
  
  func getAppGroupSuiteName() -> String? {
      guard let extentionBundleIdentifier = Bundle.main.bundleIdentifier else {
          NSLog("❌ Could not get extension bundle identifier")
          return nil
      }

      var allwords = extentionBundleIdentifier.components(separatedBy: ".")
      allwords.removeLast()

      guard !allwords.isEmpty else {
          NSLog("⚠️ Could not determine bundle identifier for App Group")
          return nil
      }

      let bundleIdentifier = allwords.joined(separator: ".")
      let suiteName = "group." + bundleIdentifier
      NSLog("📦 Derived App Group suite name: %@", suiteName)
      return suiteName
  }

  func normalizeNumber(_ input: String) -> String {
      // Step 1: Clean the number (keep only digits and +)
      var number = input.replacingOccurrences(of: "[^0-9+]", with: "", options: .regularExpression)

      // Step 2: Get digits only for length check
      let digitsOnly = number.replacingOccurrences(of: "[^0-9]", with: "", options: .regularExpression)

      // Step 3: Apply logic only if number > 8 digits
      guard digitsOnly.count > 8 else {
          return number
      }

      // Step 4: Get country code from shared UserDefaults
      let suiteName = getAppGroupSuiteName() ?? "group.com.tragofone.app"
      NSLog("We got the suite name from UserDefaults as: %@", suiteName as NSString)
      let userDefaults = UserDefaults(suiteName: suiteName)
      let countryCode = userDefaults?.string(forKey: "country_code") ?? ""
    
      NSLog("We got the country code from UserDefaults as : %@", countryCode)

      // If country code is empty or invalid, just return cleaned number
      guard !countryCode.isEmpty else {
          return number
      }

      // === CASE 1: Starts with + and country code ===
      if number.hasPrefix("+\(countryCode)") {
          return String(number.dropFirst(countryCode.count + 1))
      }
    
      // === CASE 2: Starts with 00 followed by country code ===
      if number.hasPrefix("00" + countryCode) {
          return String(number.dropFirst(2 + countryCode.count))
      }
    
      // === CASE 3: Starts with 0 followed by country code ===
      if number.hasPrefix("0" + countryCode) {
          return String(number.dropFirst(1 + countryCode.count))
      }
    
      // === CASE 4: Starts with 00 ===
      if number.hasPrefix("00") {
          return String(number.dropFirst(2))
      }

      // === CASE 5: Starts with 0 ===
      if number.hasPrefix("0") {
          return String(number.dropFirst(1))
      }

      // === CASE 6: Starts with country code without + ===
      if number.hasPrefix(countryCode) {
          return String(number.dropFirst(countryCode.count))
      }

      // === CASE 7: Return as-is ===
      return number
  }

  func generateVariants(for number: String) -> [String] {
      let normalized = normalizeNumber(number)
      var variants = Set<String>()

      // Get country code from shared UserDefaults
      let suiteName = getAppGroupSuiteName() ?? "group.com.tragofone.app"
      NSLog("We got the suite name from UserDefaults as: %@", suiteName as NSString)
      let userDefaults = UserDefaults(suiteName: suiteName)
      let countryCode = userDefaults?.string(forKey: "country_code") ?? ""

      NSLog("📞 Input Number: %@", number)
      NSLog("🔄 Normalized Number: %@", normalized)
      NSLog("🌍 Country Code from UserDefaults: %@", countryCode)

      // Always include the original and normalized numbers
      variants.insert(number)
      variants.insert(normalized)

      // Only generate more variants if normalized is longer than 8 and country code is valid
      if normalized.count > 8, !countryCode.isEmpty {

          // Construct all meaningful variants
          variants.insert("+\(countryCode)\(normalized)")       // +91XXXX
          variants.insert("0\(normalized)")                     // 0XXXX
          variants.insert("00\(normalized)")                    // 00XXXX
          variants.insert("\(countryCode)\(normalized)")        // 91XXXX
          variants.insert("0\(countryCode)\(normalized)")       // 0 + 91 + num
          variants.insert("00\(countryCode)\(normalized)")      // 00 + 91 + num
      }

      // Log all variants for debugging
      NSLog("📋 Generated Variants:")
      for variant in variants {
          NSLog("• %@", variant)
      }

      return Array(variants)
  }

  func getContactName(for incomingNumber: String) -> String? {
      let suiteName = getAppGroupSuiteName() ?? "group.com.tragofone.app"
      NSLog("We got the suite name from UserDefaults as: %@", suiteName as NSString)
      guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: suiteName) else {
          NSLog("❌ Failed to get App Group container URL")
          return nil
      }

      let localFileURL = containerURL.appendingPathComponent("local_contact.json")
      let remoteFileURL = containerURL.appendingPathComponent("remote_contact.json")
      let privateFileURL = containerURL.appendingPathComponent("private_contact.json")
      let teamFileURL = containerURL.appendingPathComponent("team_contact.json")

      let variants = generateVariants(for: incomingNumber)

      // Helper to search a given file
      func searchFile(_ fileURL: URL) -> String? {
          guard let data = try? Data(contentsOf: fileURL),
                let dict = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: String] else {
              NSLog("❌ Failed to read or parse file at %@", fileURL.path)
              return nil
          }

          for variant in variants {
              if let name = dict[variant] {
                  NSLog("✅ Matched variant \(variant) with name \(name) in file %@", fileURL.lastPathComponent)
                  return name
              }
          }
          return nil
      }
    
      // priority : private -> local -> team -> enterprise priority -> enterprise

      // Search private first
      if let name = searchFile(privateFileURL) {
          return name
      }
    
      // Search local
      if let name = searchFile(localFileURL) {
          return name
      }
    
      // Search Team
      if let name = searchFile(teamFileURL) {
          return name
      }

      // Then remote
      if let name = searchFile(remoteFileURL) {
          return name
      }

      NSLog("📭 No match found in either file for number: %@", incomingNumber)
      return nil
  }
    
    // MARK: - E164 Number Conversion Functions
    
    /// Check if a number is valid E164 format
    /// - Parameter number: The phone number to validate
    /// - Returns: True if the number is valid E164 format
    func isNumberValidE164(_ number: String?) -> Bool {
        guard let number = number else { return false }
        
        let regex = try? NSRegularExpression(pattern: "^\\+[1-9]\\d{1,14}$", options: [])
        guard let regex = regex else {
            NSLog("Regex error: Failed to create regex pattern")
            return false
        }
        
        let range = NSRange(location: 0, length: number.utf16.count)
        let matches = regex.numberOfMatches(in: number, options: [], range: range)
        return matches > 0
    }
    
    /// Convert a phone number to E164 format
    /// - Parameters:
    ///   - number: The phone number to convert
    ///   - defaultCountryPhoneCode: The default country phone code
    /// - Returns: The converted E164 number
    func convertNumberToE164(_ number: String?, defaultCountryPhoneCode: String?) -> String {
        guard let number = number else { return "" }
        
        NSLog("convertNumberToE164: number=%@, defaultCountryPhoneCode=%@", number, defaultCountryPhoneCode ?? "nil")
        
        if isNumberValidE164(number) {
            NSLog("number is valid e164 number: %@", number)
            return number
        }
        
        let hasDefaultCode = (defaultCountryPhoneCode != nil && !defaultCountryPhoneCode!.isEmpty)
        
        if hasDefaultCode {
            if number.count > 8 && number.hasPrefix("00") {
                let converted = "+" + String(number.dropFirst(2))
                NSLog("Converted for starting with 00: %@", converted)
                return converted
            } else if number.count > 8 && number.hasPrefix("0") {
                let converted = "+" + defaultCountryPhoneCode! + String(number.dropFirst(1))
                NSLog("Converted for starting with 0: %@", converted)
                return converted
            } else if number.count > 8 && number.hasPrefix(defaultCountryPhoneCode!) {
                let converted = "+" + number
                NSLog("Converted for starting with country code (no +): %@", converted)
                return converted
            } else if number.count > 8 {
                let converted = "+" + defaultCountryPhoneCode! + number
                NSLog("Converted for number > 8: %@", converted)
                return converted
            } else {
                NSLog("Number length <= 8, leaving as-is: %@", number)
                return number
            }
        } else {
            NSLog("No default country code; leaving as-is: %@", number)
            return number
        }
    }
    
    /// Get country code from UserDefaults
    /// - Returns: The country code from preferences
    func getCountryCodeFromPrefs() -> String? {

        let suiteName = getAppGroupSuiteName() ?? "group.com.ubecall.app"
        NSLog("We got the suite name from UserDefaults as: %@", suiteName as NSString)
        let userDefaults = UserDefaults(suiteName: suiteName)
        let countryCode = userDefaults?.string(forKey: "country_code") ?? ""
        NSLog("We got the country code from UserDefaults as : %@", countryCode)
        return countryCode
    }
    
    
    
    /// Send message conversion algorithm
    /// - Parameter number: The phone number to convert
    /// - Returns: The converted E164 number
    func sendMessageConversionAlgo(_ number: String?) -> String {
        NSLog("sendMessageConversionAlgo number -> %@", number ?? "nil")
        
        guard let number = number else { return "" }
        
        let defaultCode = getCountryCodeFromPrefs()
        
        if isNumberValidE164(number) {
            NSLog("number is valid e164: %@", number)
            return number
        } else {
            let converted = convertNumberToE164(number, defaultCountryPhoneCode: defaultCode)
            NSLog("Converted (non-e164) number: %@", converted)
            return converted
        }
    }
}
