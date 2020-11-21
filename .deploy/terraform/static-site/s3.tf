resource "aws_s3_bucket" "subdomain_bucket" {
  bucket = format("www.%s", var.domain_name)
  acl = "public-read"
  policy = data.aws_iam_policy_document.website_policy.json
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = var.domain_name
  acl = "public-read"
  website {
    redirect_all_requests_to = format("http://www.%s", var.domain_name)
  }
}