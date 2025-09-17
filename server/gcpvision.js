import vision from '@google-cloud/vision';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize a Vision client. Support both GOOGLE_APPLICATION_CREDENTIALS or explicit key file path.
 */
export function makeClient() {
  const explicitPath = process.env.GCP_SERVICE_ACCOUNT_JSON;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  console.log('Debug - explicitPath:', explicitPath);
  console.log('Debug - credentialsPath:', credentialsPath);
  console.log('Debug - current working directory:', process.cwd());
  
  if (explicitPath) {
    console.log('Using explicit path:', explicitPath);
    return new vision.ImageAnnotatorClient({ keyFilename: explicitPath });
  }
  
  if (credentialsPath) {
    console.log('Using credentials path:', credentialsPath);
    return new vision.ImageAnnotatorClient({ keyFilename: credentialsPath });
  }
  
  console.log('Using default credentials');
  // Fallback: try to load from default location
  return new vision.ImageAnnotatorClient();
}

/**
 * Extract printed/handwritten text from an image buffer and return a normalized math expression string.
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @returns {Promise<string>}
 */
export async function extractExpression(fileBuffer, mimeType) {
  const client = makeClient();

  // Use in-memory buffer to avoid disk I/O
  const request = {
    image: { content: fileBuffer },
    // You could also add imageContext: { languageHints: ['en'] }
  };

  const [result] = await client.textDetection(request);
  const annotations = result?.textAnnotations;

  if (!annotations || annotations.length === 0) return '';

  // First annotation is the entire text block
  let text = (annotations[0].description || '').trim();

  // Normalize common math operator glyphs and whitespace
  text = text
    .replace(/[×✕✖]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/[−–—]/g, '-')     // various dashes to ASCII minus
    .replace(/,/g, '.')         // decimal comma -> dot (optional, project-specific)
    .replace(/[^\d+\-*/().\s]/g, ' ') // drop non-whitelisted chars
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim();

  return text;
}
