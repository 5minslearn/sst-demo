import { SSTConfig } from "sst";
import {Bucket, NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";


export default {
  config(_input) {
    return {
      name: "sst-tutorial",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "public");
      const certArn = 'Replace with your certificate arn'
      const site = new NextjsSite(stack, "site",{
        bind:[bucket],
        customDomain: {
          isExternalDomain: true,
          domainName: "aws.gogosoon.com",
          cdk: {
            certificate: Certificate.fromCertificateArn(stack, "MyCert", certArn),
          },
        },
      });
      stack.addOutputs({
        SiteUrl: site.customDomainUrl || site.url,
      });
    });
  },
} satisfies SSTConfig;
