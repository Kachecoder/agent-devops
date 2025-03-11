import * as cocoSsd from '@tensorflow-models/coco-ssd';

export async function analyzeImage(imageUrl: string) {
  const model = await cocoSsd.load();
  const img = document.createElement('img');
  img.src = imageUrl;
  const predictions = await model.detect(img);
  return predictions; // Returns objects detected (e.g., products in images)
}