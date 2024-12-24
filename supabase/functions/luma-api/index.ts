import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
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
    console.log('Received request:', { action, eventData })

    if (!LUMA_API_KEY) {
      throw new Error('LUMA_API_KEY is not set')
    }

    const headers = {
      'Authorization': `Bearer ${LUMA_API_KEY}`,
      'Content-Type': 'application/json',
      ...corsHeaders,
    }

    switch (action) {
      case 'create': {
        console.log('Creating Luma event:', eventData)
        
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
          headers,
          body: JSON.stringify(lumaEvent),
        })

        if (!createResponse.ok) {
          const errorText = await createResponse.text()
          console.error('Luma API error:', errorText)
          throw new Error(`Failed to create Luma event: ${errorText}`)
        }

        const createdEvent = await createResponse.json()
        console.log('Created Luma event:', createdEvent)
        return new Response(JSON.stringify(createdEvent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'update': {
        console.log('Updating Luma event:', eventData)
        
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

        const updateResponse = await fetch(`${LUMA_API_URL}/events/${eventData.luma_id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(lumaEvent),
        })

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('Luma API error:', errorText)
          throw new Error(`Failed to update Luma event: ${errorText}`)
        }

        const updatedEvent = await updateResponse.json()
        console.log('Updated Luma event:', updatedEvent)
        return new Response(JSON.stringify(updatedEvent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'delete': {
        console.log('Deleting Luma event:', eventData.luma_id)
        
        const deleteResponse = await fetch(`${LUMA_API_URL}/events/${eventData.luma_id}`, {
          method: 'DELETE',
          headers,
        })

        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text()
          console.error('Luma API error:', errorText)
          throw new Error(`Failed to delete Luma event: ${errorText}`)
        }

        console.log('Deleted Luma event:', eventData.luma_id)
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'sync-rsvp': {
        console.log('Syncing RSVP with Luma:', eventData)
        
        const rsvpResponse = await fetch(`${LUMA_API_URL}/events/${eventData.luma_id}/guests`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email: eventData.user_email,
            status: eventData.status === 'registered' ? 'going' : 'not_going',
          }),
        })

        if (!rsvpResponse.ok) {
          const errorText = await rsvpResponse.text()
          console.error('Luma API error:', errorText)
          throw new Error(`Failed to sync RSVP with Luma: ${errorText}`)
        }

        const rsvpResult = await rsvpResponse.json()
        console.log('Synced RSVP with Luma:', rsvpResult)
        return new Response(JSON.stringify(rsvpResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})