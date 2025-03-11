import { NextResponse } from 'next/server';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export async function GET() {
  try {
    const model = await use.load();
    return NextResponse.json({
      success: true,
      message: "NLP model loaded successfully!",
      modelInfo: model.model.modelArchitecture
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Model loading failed: " + error.message
    }, { status: 500 });
  }
}