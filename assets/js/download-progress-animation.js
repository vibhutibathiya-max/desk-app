    // DOWNLOAD PROCESS :: STARTS
        class DownloadProgresAnimation {

            dashX = 0;
            dashY = 880;
            opacity = 0;
            isActive = false;

            //var animId;
            constructor(circle1) {
                this.circle = circle1;
                this.dashX = 0;
                this.dashY = 880;
                this.opacity = 0;
                this.isActive = false;

                // this.drawCircle = this.drawCircle.bind(this);
                this.draw = this.draw.bind(this);
                this.cancelDownloadAnimaton = this.cancelDownloadAnimaton.bind(this);
                this.startDownloadAnimation = this.startDownloadAnimation.bind(this);
            }

            draw() {
                var rate = Math.random() * 4; //simulate download speed fluctuation
                this.dashY -= rate;
                this.dashX += rate;
                if (this.dashY <= 0) {
                    cancelAnimationFrame(this.draw);
                    //animationComplete();
                }
                else {
                    this.animId = requestAnimationFrame(this.draw);
                }
                this.circle.css('stroke-dasharray', '' + this.dashX + ' ' + this.dashY + '');
            }

            cancelDownloadAnimaton() {
                this.isActive = false;
                cancelAnimationFrame(this.animId);
                this.circle.css('stroke-dasharray', '0 880');
                this.circle.css('stroke-width', '0');
                this.dashX = 0;
                this.dashY = 880;
            }

            startDownloadAnimation() {
                this.isActive = true;
                this.circle.css('stroke-width', '20px');
                this.circle.css('opacity', '1');
                this.animId = requestAnimationFrame(this.draw);
            }
        }
