#!/bin/bash

# Raspberry Pi Kiosk Dashboard Setup Script
# Run this script on your Raspberry Pi to set up the kiosk mode

set -e

echo "=========================================="
echo "Pi Kiosk Dashboard Setup"
echo "=========================================="

# Check if running on Raspberry Pi
if [ ! -f /proc/device-tree/model ]; then
    echo "Warning: This script is designed for Raspberry Pi"
    echo "Continuing anyway..."
fi

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y \
    chromium-browser \
    unclutter \
    xdotool \
    lightdm \
    openbox

# Install Node.js if not present (for building)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Create autostart directory
mkdir -p ~/.config/openbox

# Create autostart script for kiosk mode
cat > ~/.config/openbox/autostart << 'EOF'
# Disable screen blanking/power saving
xset s off
xset s noblank
xset -dpms

# Hide mouse cursor when idle
unclutter -idle 1 -root &

# Wait for network
sleep 10

# Start Chromium in kiosk mode
chromium-browser \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --disable-translate \
    --no-first-run \
    --fast \
    --fast-start \
    --disable-features=TranslateUI \
    --disk-cache-dir=/tmp/chromium-cache \
    --check-for-update-interval=31536000 \
    http://localhost:8080 &
EOF

# Create systemd service for the web server
echo "Creating systemd service..."
sudo tee /etc/systemd/system/pi-kiosk-dashboard.service > /dev/null << EOF
[Unit]
Description=Pi Kiosk Dashboard Web Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npx serve -s dist -l 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable pi-kiosk-dashboard.service

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy your .env file with API keys"
echo "2. Run 'npm run build' to build the dashboard"
echo "3. Run 'sudo systemctl start pi-kiosk-dashboard' to start the web server"
echo "4. Configure your Pi to boot into desktop/kiosk mode"
echo "5. Reboot to test: sudo reboot"
echo ""
echo "To manually test: npm run preview"
