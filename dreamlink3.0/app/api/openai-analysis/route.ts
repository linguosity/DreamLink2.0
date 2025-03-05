import { NextResponse } from "next/server";
import axios from 'axios';

export const runtime = "edge"; // Use Edge Runtime

export async function POST(request: Request) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const requestStartTime = Date.now();
  console.log(`🚀 [${requestId}] OpenAI Edge Function: Request received`);
  console.log(`🌐 [${requestId}] Runtime environment: ${process.env.VERCEL_ENV || 'local'}`);
  console.log(`⏱️ [${requestId}] Request started: ${new Date().toISOString()}`);
  
  try {
    console.log(`🔍 [${requestId}] OpenAI Edge Function: Processing request`);
    
    const { dream, topic } = await request.json();
    console.log(`🔍 [${requestId}] Dream content received. Length: ${dream?.length || 0} chars`);
    console.log(`🔍 [${requestId}] Analysis topic: ${topic || 'general spiritual meaning'}`);
    console.log(`🔧 [${requestId}] User agent: ${request.headers.get('user-agent')}`);
    console.log(`🔧 [${requestId}] Content type: ${request.headers.get('content-type')}`);
    
    if (!dream) {
      console.log(`❌ [${requestId}] Error: Dream content is missing`);
      return NextResponse.json({ error: "Dream content is required" }, { status: 400 });
    }
    
    const prompt = `
You are a dream interpreter specializing in Christian biblical interpretation.

Analyze the following dream, connecting it to biblical themes, symbols, and scriptures:
"${dream}"

Format your analysis using this exact structure:
1. Start with a topic sentence that captures the main spiritual theme of the dream.
2. Provide exactly 3 supporting points. Each point should include a direct Bible citation in parentheses.
3. End with a concluding sentence that provides guidance based on the dream's meaning.

Example format:
"This dream reflects God's promise of provision in times of uncertainty. The water symbolizes God's spirit bringing renewal (Isaiah 44:3), while the mountain represents the challenges you're facing (Zechariah 4:7), and the light breaking through suggests divine intervention (John 1:5). Consider how God might be preparing you for upcoming changes that require faith and trust."

Additional instruction:
- Focus analysis on theme: ${topic || 'general spiritual meaning'}
- Keep each supporting point brief but insightful
- Include exactly 3 biblical references (one per supporting point)
- Ensure each supporting point has logical connection to the dream content
- Use parenthetical citations (Book Chapter:Verse)
- Make the concluding sentence actionable but gentle
- Total response should be 4 sentences total: topic, 3 supports with citations, conclusion
`;

    console.log(`🔍 [${requestId}] Preparing OpenAI API call`);
    console.log(`🔍 [${requestId}] API Key present: ${process.env.OPENAI_API_KEY ? 'Yes (masked)' : 'No'}`);
    console.log(`🔧 [${requestId}] OpenAI model: gpt-4o-mini-2024-07-18`);
    console.log(`🔧 [${requestId}] Request timestamp: ${Date.now()}`);
    
    // Initialize variables to be used across try-catch blocks
    let analysis = '';
    let topicSentence = '';
    let supportingPoints = [];
    let conclusionSentence = '';
    
    try {
      console.log(`🔍 [${requestId}] Sending request to OpenAI API`);
      console.log(`🔍 [${requestId}] API Key length: ${process.env.OPENAI_API_KEY?.length || 0}`);
      console.log(`🔍 [${requestId}] API Key prefix: ${process.env.OPENAI_API_KEY?.substring(0, 5) || "missing"}`);
      console.log(`⏱️ [${requestId}] API request start time: ${new Date().toISOString()}`);
      
      // Create request payload with the original model
      const requestPayload = {
        model: "gpt-4o-mini-2024-07-18", // Original model as specified
        messages: [
          { role: "system", content: "You are a biblical dream interpreter who provides concise analysis with scripture references." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              topicSentence: {
                type: "string",
                description: "A sentence capturing the main spiritual theme of the dream"
              },
              supportingPoints: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "Three supporting points, each with a direct Bible citation in parentheses"
              },
              conclusionSentence: {
                type: "string",
                description: "A concluding sentence that provides guidance based on the dream's meaning"
              },
              analysis: {
                type: "string",
                description: "The full analysis combining all parts"
              }
            },
            required: ["topicSentence", "supportingPoints", "conclusionSentence", "analysis"],
            additionalProperties: false
          }
        }
      };
      
      console.log(`🔍 [${requestId}] Request payload:`, JSON.stringify(requestPayload));
      
      let data;
      
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.openai.com/v1/chat/completions',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          data: requestPayload
        });

        const apiRequestEndTime = new Date().toISOString();
        console.log(`⏱️ [${requestId}] API request end time: ${apiRequestEndTime}`);
        console.log(`⏱️ [${requestId}] API response time: ${Date.now() - new Date(apiRequestEndTime).getTime()}ms`);
        console.log(`🔍 [${requestId}] OpenAI API response status: ${response.status}`);
        
        // Axios parses JSON automatically
        console.log(`🔍 [${requestId}] Raw API response:`, JSON.stringify(response.data).substring(0, 200) + "...");
        
        // With axios, the data is already parsed
        data = response.data;
        console.log(`✅ [${requestId}] OpenAI API response received successfully`);
        console.log(`📊 [${requestId}] Token usage:`, JSON.stringify(response.data.usage));
        
      } catch (axiosError) {
        console.error(`❌ [${requestId}] OpenAI API error:`, axiosError.message);
        console.error(`❌ [${requestId}] Error code:`, axiosError.code);
        console.error(`❌ [${requestId}] Response status:`, axiosError.response?.status);
        console.error(`❌ [${requestId}] Response data:`, JSON.stringify(axiosError.response?.data));
        
        return NextResponse.json({ 
          error: "OpenAI API error", 
          details: axiosError.response?.data || axiosError.message,
          status: axiosError.response?.status || 500
        }, { status: axiosError.response?.status || 500 });
      }
      
      console.log(`✅ [${requestId}] OpenAI API response parsed:`, JSON.stringify(data).substring(0, 100) + "...");
      
      // Extract the JSON content from the OpenAI response
      let structuredResponse;
      
      try {
        // Try to access the message content
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid API response structure: missing choices or message");
        }
        
        const messageContent = data.choices[0].message.content;
        console.log(`✅ [${requestId}] Message content type:`, typeof messageContent);
        console.log(`✅ [${requestId}] Message content:`, typeof messageContent === 'string' ? messageContent.substring(0, 200) : JSON.stringify(messageContent).substring(0, 200));
        
        // Parse the content if it's a string, otherwise use as is if it's already an object
        if (typeof messageContent === 'string') {
          try {
            structuredResponse = JSON.parse(messageContent);
          } catch (jsonError) {
            console.error("❌ Error parsing message content as JSON:", jsonError);
            throw new Error("Message content is not valid JSON");
          }
        } else if (typeof messageContent === 'object') {
          structuredResponse = messageContent;
        } else {
          throw new Error(`Unexpected message content type: ${typeof messageContent}`);
        }
        
        console.log(`✅ [${requestId}] Structured response:`, JSON.stringify(structuredResponse).substring(0, 200));
        
        // Validate the required fields
        if (!structuredResponse.topicSentence || !structuredResponse.supportingPoints || 
            !Array.isArray(structuredResponse.supportingPoints) || 
            !structuredResponse.conclusionSentence) {
          throw new Error("Response missing required fields");
        }
        
      } catch (parseError) {
        console.error(`❌ [${requestId}] Error processing structured response:`, parseError.message);
        console.error(`❌ [${requestId}] Error stack:`, parseError.stack);
        // Instead of throwing, provide a fallback response
        structuredResponse = {
          analysis: "Unable to process dream analysis due to formatting error.",
          topicSentence: "Your dream contains meaningful symbolic elements.",
          supportingPoints: [
            "Dreams often reflect our inner thoughts (Proverbs 23:7)",
            "Symbols in dreams can have personal significance (Genesis 41:25)",
            "Biblical wisdom can help interpret dream meanings (Daniel 2:28)"
          ],
          conclusionSentence: "Consider journaling about this dream to explore its personal meaning."
        };
      }
      
      // Extract the structured fields directly (with safer assignment)
      topicSentence = structuredResponse.topicSentence || '';
      supportingPoints = structuredResponse.supportingPoints || [];
      conclusionSentence = structuredResponse.conclusionSentence || '';
      
      // If analysis field is missing, construct it from other fields
      if (!structuredResponse.analysis) {
        analysis = `${topicSentence}. ${supportingPoints.join('. ')}. ${conclusionSentence}.`;
        console.log("🔄 Generated missing analysis field:", analysis);
      } else {
        analysis = structuredResponse.analysis;
      }
      
      console.log(`✅ [${requestId}] Topic sentence: ${topicSentence}`);
      console.log(`✅ [${requestId}] Supporting points: ${supportingPoints.length} received`);
      console.log(`✅ [${requestId}] Conclusion: ${conclusionSentence}`);
      console.log(`✅ [${requestId}] Analysis length: ${analysis?.length || 0} chars`);
      console.log(`⏱️ [${requestId}] Processing completed: ${new Date().toISOString()}`);
      
    } catch (fetchError) {
      console.error(`❌ [${requestId}] Error during OpenAI API fetch:`, fetchError.message);
      console.error(`❌ [${requestId}] Error stack:`, fetchError.stack);
      console.error(`❌ [${requestId}] Request failed at:`, new Date().toISOString());
      return NextResponse.json({ 
        error: "Failed to call OpenAI API", 
        details: fetchError.message,
        requestId: requestId
      }, { status: 500 });
    }
    
    console.log(`✅ [${requestId}] Preparing response`);
    
    // Since we're using JSON schema response, everything is already structured correctly
    const response = {
      analysis,
      topicSentence,
      supportingPoints,
      conclusionSentence,
      formatted: true,
      requestId: requestId,
      timestamp: Date.now()
    };
    
    console.log(`✅ [${requestId}] Response ready to send`);
    console.log(`✅ [${requestId}] Response size: ${JSON.stringify(response).length} bytes`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error(`❌ [${requestId}] OpenAI API error:`, error.message);
    console.error(`❌ [${requestId}] Error stack:`, error.stack);
    console.error(`❌ [${requestId}] Request completely failed at:`, new Date().toISOString());
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze dream', 
        details: error.message,
        requestId: requestId,
        timestamp: Date.now()
      },
      { status: 500 }
    );
  } finally {
    const endTime = Date.now();
    console.log(`🏁 [${requestId}] Request completed at: ${new Date().toISOString()}`);
    console.log(`🏁 [${requestId}] Total processing time: ${endTime - requestStartTime}ms`);
  }
}