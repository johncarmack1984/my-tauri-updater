# Sensitive identity kept out of this public repo: the admin principal ARNs
# (account id + IAM user name) live in a gitignored terraform.tfvars, not here.
# See terraform.tfvars.example for the shape.

variable "admin_principal_arns" {
  description = "IAM principals allowed to list/write the updater bucket (account root + the admin user). Supplied via gitignored terraform.tfvars."
  type        = list(string)
}
