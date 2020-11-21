resource "aws_route53_zone" "primary" {
  name = var.domain_name
}

resource "aws_route53_record" "domain" {
  zone_id = aws_route53_zone.primary.zone_id
  name = var.domain_name
  type = "A"
  alias {
    name = aws_s3_bucket.website_bucket.website_domain
    zone_id = aws_s3_bucket.website_bucket.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "subdomain" {
  zone_id = aws_route53_zone.primary.zone_id
  name = format("www.%s", var.domain_name)
  type = "A"
  alias {
    name = aws_s3_bucket.website_bucket.website_domain
    zone_id = aws_s3_bucket.website_bucket.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ns" {
  allow_overwrite = true
  name            = var.domain_name
  ttl             = "60"
  type            = "NS"
  zone_id         = aws_route53_zone.primary.zone_id

  records = [
    aws_route53_zone.primary.name_servers[0],
    aws_route53_zone.primary.name_servers[1],
    aws_route53_zone.primary.name_servers[2],
    aws_route53_zone.primary.name_servers[3],
  ]
}

resource "aws_route53_record" "soa" {
  allow_overwrite = true
  name            = var.domain_name
  ttl             = "60"
  type            = "SOA"
  zone_id         = aws_route53_zone.primary.zone_id

  records = [
    format("%s. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400", aws_route53_zone.primary.name_servers[0])
  ]
}