# Moved verbatim from my-infra/storage 2025-06 (config + state). Hosts the Tauri
# updater endpoint for this app (the bucket CONTENTS — update manifests/binaries —
# are published by the release workflow in .github, not by Terraform).

# __generated__ by Terraform from "my-tauri-updater"
resource "aws_s3_bucket" "my_tauri_updater" {
  bucket              = "my-tauri-updater"
  bucket_namespace    = "global"
  force_destroy       = false
  object_lock_enabled = false
  region              = "us-west-1"
  tags                = {}
  tags_all            = {}
}

# __generated__ by Terraform from "my-tauri-updater"
resource "aws_s3_bucket_ownership_controls" "my_tauri_updater" {
  bucket = "my-tauri-updater"
  region = "us-west-1"
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# __generated__ by Terraform from "my-tauri-updater"
resource "aws_s3_bucket_public_access_block" "my_tauri_updater" {
  block_public_acls       = false
  block_public_policy     = false
  bucket                  = "my-tauri-updater"
  ignore_public_acls      = false
  region                  = "us-west-1"
  restrict_public_buckets = false
}

# __generated__ by Terraform from "my-tauri-updater"
resource "aws_s3_bucket_policy" "my_tauri_updater" {
  bucket = "my-tauri-updater"
  policy = jsonencode({
    Statement = [{
      Action = "s3:ListBucket"
      Effect = "Allow"
      Principal = {
        AWS = var.admin_principal_arns
      }
      Resource = "arn:aws:s3:::my-tauri-updater"
      }, {
      Action = ["s3:PutObject", "s3:DeleteObject"]
      Effect = "Allow"
      Principal = {
        AWS = var.admin_principal_arns
      }
      Resource = "arn:aws:s3:::my-tauri-updater/*"
      }, {
      Action = "s3:GetObject"
      Effect = "Allow"
      Principal = {
        AWS = "*"
      }
      Resource = "arn:aws:s3:::my-tauri-updater/*"
      Sid      = "AllowPublicRead"
    }]
    Version = "2012-10-17"
  })
  region = "us-west-1"
}

# __generated__ by Terraform from "my-tauri-updater"
resource "aws_s3_bucket_website_configuration" "my_tauri_updater" {
  bucket = "my-tauri-updater"
  region = "us-west-1"
  index_document {
    suffix = "index.html"
  }
}
