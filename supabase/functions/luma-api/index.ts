import { serve } from 'https://deno.fresh.run/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const LUMA_API_KEY = Deno.env.get('LUMA_API_KEY')
const LUMA_API_URL = 'https://api.lu.ma/v1'

interface LumaEvent {
  name: string
  description?: string
  start_at: string
  end_at: string
  timezone: string
  location?: string
  is_online?: boolean
  meeting_url?: string
  capacity?: number
  cover_image_url?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, eventData } = await req.json()

    if (!LUMA_API_KEY) {
      throw new Error('LUMA_API_KEY is not set')
    }

    switch (action) {
      case 'create':
        const lumaEvent: LumaEvent = {
          name: eventData.title,
          description: eventData.description,
          start_at: eventData.start_time,
          end_at: eventData.end_time,
          timezone: eventData.timezone,
          location: eventData.location,
          is_online: eventData.is_online,
          meeting_url: eventData.meeting_url,
          capacity: eventData.max_capacity,
          cover_image_url: eventData.cover_image,
        }

        const createResponse = await fetch(`${LUMA_API_URL}/events`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LUMA_API_KEY}`,
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
          body: JSON.stringify(lumaEvent),
        })

        if (!createResponse.ok) {
          throw new Error(`Failed to create Luma event: ${await createResponse.text()}`)
        }

        const createdEvent = await createResponse.json()
        console.log('Created Luma event:', createdEvent)

        return new Response(JSON.stringify(createdEvent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})