import { useState, useEffect } from 'react'
import api from '../utils/api'
import { Link } from 'react-router-dom'

const EventsList = () => {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = {}
        if (search) params.search = search
        if (category) params.category = category
        if (location) params.location = location
        if (date) params.date = date
        if (tags) params.tags = tags

        const res = await api.get('/events', { params })
        setEvents(res.data)
      } catch (err) {
        console.error('Failed to load events', err)
      }
    }
    fetchEvents()
  }, [search, category, location, date, tags])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">All Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        <input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event._id} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div>
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-xl text-gray-900 leading-tight">{event.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap ml-2">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-700 mb-3 font-medium">by {event.organizer}</p>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{new Date(event.dateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {event.availableSeats} seats left
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.capacity} total
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-5">
                {event.tags && event.tags.length > 0 && (
                  <>
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        #{tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{event.tags.length - 3} more
                      </span>
                    )}
                  </>
                )}
              </div>
              <Link 
                to={`/events/${event._id}`}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 block text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 mt-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}

export default EventsList