# CircleCI Dashboard
## Using AWS-CDK with Typescript

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

# Introduction
This project was built as a lunch time side-project and demonstrates a simple SaaS (System as a service) architecture in AWS. The frontend is written in React with webpack and babel configured manually.

# AWS Technologies Used
* AppSync - For the GraphQL API
* Lambda - Used for consuming the CircleCI API and resolving into our own GraphQL type
* S3 w/ CloudFront - For hosting the website with a CDN