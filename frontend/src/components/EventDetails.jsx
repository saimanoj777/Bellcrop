import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`)
        setEvent(res.data)
      } catch (err) {
        setError('Event not found')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const handleRegister = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await api.post(`/events/${id}/register`)
      setEvent(res.data.event || {
        ...event,
        availableSeats: event.availableSeats - 1
      })
      alert('Successfully registered!')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleCancel = async () => {
    try {
      const res = await api.post(`/events/${id}/cancel`)
      setEvent(res.data.event || {
        ...event,
        availableSeats: event.availableSeats + 1
      })
      alert('Registration cancelled')
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-600 font-medium">Loading event details...</div>
  if (error) return <div className="text-red-600 text-center py-10 font-medium">{error}</div>
  if (!event) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
          <p className="text-indigo-100 text-lg">Hosted by {event.organizer}</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</h3>
                  <p className="text-lg text-gray-900 mt-1">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date & Time</h3>
                  <p className="text-lg text-gray-900 mt-1">{new Date(event.dateTime).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.166 1.442.492.418.326.744.764.952 1.26H19c.638 0 1.22.304 1.606.795.386.491.578 1.1.54 1.72l-.5 4c-.066 1.08-1.005 2-2.05 2H6.724c-1.045 0-1.984-.92-2.05-2l-.5-4c-.038-.62.154-1.229.54-1.72.386-.491.968-.795 1.606-.795z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category</h3>
                  <p className="text-lg text-gray-900 mt-1">{event.category}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Seats</span>
                  <span className="font-medium text-indigo-600">{event.availableSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-medium text-gray-900">{event.capacity}</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${((event.capacity - event.availableSeats) / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {(event.capacity - event.availableSeats)}/{event.capacity} booked
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {event.tags && event.tags.length > 0 ? (
                event.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No tags available for this event</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleRegister}
            disabled={event.availableSeats <= 0}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {event.availableSeats <= 0 ? 'Sold Out' : 'Register Now'}
          </button>
          
          <button
            onClick={handleCancel}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Cancel Registration
          </button>
        </div>
      )}

      {!user && (
        <div className="pt-6 border-t border-gray-200 mt-6">
          <p className="text-center text-gray-600">
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 underline"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </button> to register for this event
          </p>
        </div>
      )}
    </div>
  )
}

export default EventDetails