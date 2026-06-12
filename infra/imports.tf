# Config-driven imports — the my-tauri-updater S3 bucket and its sub-resources,
# moved out of my-infra/storage into this project's own infra/ root.

import {
  to = aws_s3_bucket.my_tauri_updater
  id = "my-tauri-updater"
}

import {
  to = aws_s3_bucket_ownership_controls.my_tauri_updater
  id = "my-tauri-updater"
}

import {
  to = aws_s3_bucket_public_access_block.my_tauri_updater
  id = "my-tauri-updater"
}

import {
  to = aws_s3_bucket_policy.my_tauri_updater
  id = "my-tauri-updater"
}

import {
  to = aws_s3_bucket_website_configuration.my_tauri_updater
  id = "my-tauri-updater"
}
