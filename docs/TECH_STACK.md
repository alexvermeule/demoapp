# Tech Stack Documentation

## Overview
AI-Powered Flashcard Application with local development and AWS deployment strategy.

## Architecture Philosophy
- **Local First**: Start with local development using SQLite and local file storage
- **Cloud Ready**: Design for easy migration to AWS services
- **Scalable**: Built to handle growth from MVP to production scale
- **Cost Effective**: Minimize costs during development, optimize for production

## Current Stack (Local Development)

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS v4**: Utility-first CSS framework
- **Turbopack**: Fast development bundler

### Authentication
- **Clerk.com**: Modern authentication service
  - Social logins (Google, GitHub, etc.)
  - User management dashboard
  - JWT tokens and session management
  - Easy integration with Next.js

### Database (Local → AWS Migration Path)
- **Phase 1 (Local)**: SQLite with Prisma ORM
- **Phase 2 (AWS)**: PostgreSQL on AWS RDS
- **Migration**: Prisma handles schema migrations seamlessly

### File Storage (Local → AWS Migration Path)
- **Phase 1 (Local)**: Local file system storage
- **Phase 2 (AWS)**: AWS S3 with CloudFront CDN
- **Migration**: Abstract file operations behind service layer

### AI Integration
- **OpenAI API**: For document processing and flashcard generation
- **Alternative**: Claude API (Anthropic)
- **Features**: PDF parsing, text extraction, intelligent flashcard creation

## Planned AWS Architecture

### Hosting
- **AWS EC2** or **AWS ECS**: Container-based deployment
- **AWS Application Load Balancer**: Traffic distribution
- **AWS CloudFront**: CDN for global content delivery

### Database
- **AWS RDS PostgreSQL**: Managed database service
- **AWS RDS Proxy**: Connection pooling and management
- **Automated backups**: Point-in-time recovery

### Storage
- **AWS S3**: Document and media storage
- **AWS CloudFront**: Fast global content delivery
- **AWS Lambda**: File processing triggers

### Monitoring & Logging
- **AWS CloudWatch**: Application monitoring
- **AWS X-Ray**: Distributed tracing
- **AWS CloudTrail**: API call logging

### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **AWS CodeDeploy**: Blue-green deployments
- **AWS Systems Manager**: Configuration management

## Development Workflow

### Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Automated Releases**: npm scripts for version bumping
- **Changelog**: Automated generation from commits
- **Git Tags**: Automatic tagging for releases

### Release Process
1. Feature development on feature branches
2. Pull request with code review
3. Merge to main triggers automated testing
4. Manual release command creates version tag
5. Automated deployment to staging/production

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run code linting
npm run version:patch # Bump patch version
npm run version:minor # Bump minor version
npm run version:major # Bump major version
npm run release      # Build and create release
```

## Security Considerations

### Authentication
- JWT tokens with proper expiration
- Secure session management via Clerk
- Role-based access control (RBAC)

### Data Protection
- Encryption at rest (AWS RDS encryption)
- Encryption in transit (HTTPS/TLS)
- Secure file upload validation

### API Security
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration

## Cost Optimization

### Development Phase
- Local SQLite (free)
- Local file storage (free)
- Clerk.com free tier (10,000 MAU)
- OpenAI API pay-per-use

### Production Phase
- AWS Free Tier utilization
- Auto-scaling based on demand
- S3 Intelligent Tiering
- CloudFront caching optimization

## Migration Strategy

### Phase 1: Local Development
- SQLite database
- Local file storage
- Development authentication

### Phase 2: Hybrid (Database Migration)
- Migrate to AWS RDS PostgreSQL
- Keep local file storage
- Production authentication setup

### Phase 3: Full AWS Migration
- Migrate to S3 file storage
- Set up CloudFront CDN
- Implement monitoring and logging

### Phase 4: Production Optimization
- Auto-scaling configuration
- Performance monitoring
- Cost optimization
- Backup and disaster recovery

## Dependencies

### Core Dependencies
```json
{
  "next": "15.3.5",
  "react": "^19.0.0",
  "typescript": "^5",
  "@clerk/nextjs": "^4.x",
  "prisma": "^5.x",
  "openai": "^4.x"
}
```

### Planned Dependencies
- `@prisma/client`: Database ORM
- `@clerk/nextjs`: Authentication
- `openai`: AI integration
- `aws-sdk`: AWS services integration
- `multer`: File upload handling
- `pdf-parse`: PDF document processing

## Environment Configuration

### Local Development
```env
DATABASE_URL="file:./dev.db"
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-..."
```

### AWS Production
```env
DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/db"
CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
OPENAI_API_KEY="sk-..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
S3_BUCKET_NAME="flashcard-app-storage"
```

## Next Steps
1. Set up Prisma with SQLite
2. Integrate Clerk authentication
3. Create basic flashcard CRUD operations
4. Implement spaced repetition algorithm
5. Add AI document processing
6. Plan AWS migration timeline 