#!/bin/bash

# 1. Add all changes (HTML, CSS, PDF, etc.)
git add .

# 2. Create a commit with the current date and time
msg="Update: $(date +'%Y-%m-%d %H:%M:%S')"
git commit -m "$msg"

# 3. Push to GitHub
git push origin main

echo "✅ Main Hub updated successfully!"
