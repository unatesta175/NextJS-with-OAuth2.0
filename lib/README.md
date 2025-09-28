# Configuration Usage

## Centralized URL Configuration

The `config.ts` file provides centralized configuration for all URLs in the application.

### Usage Examples:

```typescript
import { getAssetUrl, API_BASE_URL, getApiUrl } from '@lib/config';

// For images
<Image src={getAssetUrl(category.image)} alt={category.name} />
// Results in: http://localhost:8000/service-category/sc1.png

// For API calls  
const response = await axios.get('/service-categories');
// Base URL automatically handled by axios config

// To change URLs, edit config.ts:
export const config = {
  api: {
    baseURL: 'http://localhost:8000', // Change this for production
  },
  assets: {
    baseURL: 'http://localhost:8000', // Change this for production
  }
};
```

### Environment Configuration:

For different environments, you can modify the config values:
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`
- Staging: `https://staging.your-domain.com`
