#!/bin/bash
TIMESTAMP=$(date +"%F_%H-%M-%S")
BACKUP_FILE="/backups/$TIMESTAMP"
MONGO_URI="mongodb+srv://$DB_USER:$DB_PASS@cluster0.lvga5.mongodb.net/$DB_NAME?retryWrites=true&w=majority"
DESTINATION_PATH="s3://$BUCKET_NAME/"

mkdir -p "/backups/logs"

echo "Starting backup at $(date)" >> /backups/logs/backup.log
mongodump --uri="$MONGO_URI" --out="$BACKUP_FILE"
echo "Backup completed at $(date)" >> /backups/logs/backup.log

# Optionally compress the backup
echo "Compressing $BACKUP_FILE to $BACKUP_FILE.tar.gz"
tar -czvf "$BACKUP_FILE.tar.gz" "$BACKUP_FILE"

# Upload to S3
echo "Uploading backup to S3" >> /backups/logs/backup.log
aws s3 cp "$BACKUP_FILE.tar.gz" "$DESTINATION_PATH" 2>> /backups/logs/backup.log

# Remove files
echo "Removing $BACKUP_FILE"
rm -rf "$BACKUP_FILE"

# Remove files
echo "Removing $BACKUP_FILE.tar.gz"
rm -rf "$BACKUP_FILE.tar.gz"
