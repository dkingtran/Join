Deploy package for mentors

Included:
- n8n/Join-workflow-public-anon.json
- n8n/README.md

This package intentionally excludes any secrets, `.env`, original `n8n/Join-workflow.json` and credential files.

To create a ZIP for upload:
PowerShell:
Compress-Archive -Path "deploy\*" -DestinationPath "Join_done-deploy.zip" -Force

Upload the resulting `Join_done-deploy.zip` via SFTP/FileZilla to your server or attach it to a private GitHub release.
