const IMAGE_MODEL = process.env.IMAGE_MODEL;
const BASE_PATH = process.env.BASE_PATH;

type GenerateImageParams = {
  prompt: string;
  aspectRatio?: string;
};

type OpenRouterImageResponse = {
  data?: {
    b64_json?: string;
    media_type?: string;
  }[];
};

export async function generateImage({
  prompt,
  aspectRatio = '1:1',
}: GenerateImageParams) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch(`${BASE_PATH}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      aspect_ratio: aspectRatio,
      n: 1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Recraft API error (${response.status}): ${error}`);
  }

  const result = (await response.json()) as OpenRouterImageResponse;
  const image = result.data?.[0];

  if (!image?.b64_json) {
    throw new Error('Recraft returned an empty image');
  }

  const mediaType = image.media_type || 'image/png';

  return {
    src: `data:${mediaType};base64,${image.b64_json}`,
    mediaType,
  };
}
