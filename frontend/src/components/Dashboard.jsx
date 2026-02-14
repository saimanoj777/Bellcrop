import { useState, useEffect } from 'react'
import api from '../utils/api'

const Dashboard = () => {
  const [registered, setRegistered] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)
  const [registeringEventId, setRegisteringEventId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, upRes, pastRes] = await Promise.all([
          api.get('/dashboard/registered'),
          api.get('/dashboard/upcoming'),
          api.get('/dashboard/past')
        ])

        setRegistered(regRes.data)
        setUpcoming(upRes.data)
        setPast(pastRes.data)
      } catch (err) {
        console.error('Dashboard data fetch failed', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRegister = async (eventId) => {
    try {
      setRegisteringEventId(eventId);
      const response = await api.post(`/events/${eventId}/register`);
      
      // Refresh the data after registration
      const [regRes, upRes] = await Promise.all([
        api.get('/dashboard/registered'),
        api.get('/dashboard/upcoming')
      ]);
      
      setRegistered(regRes.data);
      setUpcoming(upRes.data);
    } catch (err) {
      console.error('Registration failed', err);
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRegisteringEventId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-600 font-medium">Loading dashboard...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">My Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 text-lg text-center py-8 bg-gray-50 rounded-lg border border-gray-200">No upcoming events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(event => (
              <div key={event._id} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-900 leading-tight">{event.name}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap ml-2">
                      Upcoming
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {event.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {event.availableSeats} seats left
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
                  <button 
                    onClick={() => handleRegister(event._id)}
                    disabled={registeringEventId === event._id}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                      registeringEventId === event._id 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {registeringEventId === event._id ? 'Registering...' : 'Register Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        {past.length === 0 ? (
          <p className="text-gray-500 text-lg text-center py-8 bg-gray-50 rounded-lg border border-gray-200">No past events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map(event => (
              <div key={event._id} className="border border-gray-200 rounded-xl p-6 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight">{event.name}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 whitespace-nowrap ml-2">
                      Past
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 font-medium">by {event.organizer}</p>
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {event.category}
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
                  <button 
                    onClick={() => handleRegister(event._id)}
                    disabled={registeringEventId === event._id}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                      registeringEventId === event._id 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {registeringEventId === event._id ? 'Registering...' : 'Register Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Registered Events</h2>
        {registered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No registered events</h3>
            <p className="mt-2 text-gray-500">You haven't registered for any events yet. Explore upcoming events to get started!</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Event</th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {registered.map((event, idx) => (
                  <tr key={event._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-gray-50 transition-colors`}>
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                      <div className="font-bold text-lg">{event.name}</div>
                      <div className="text-gray-600 mt-1">by {event.organizer}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" />
                        </svg>
                        {new Date(event.dateTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19.11 10 19.22v.37c0 .22-.22.33-.31.23l-6.49-7.02a1.01 1.01 0 01-.28-.7c0-.24.05-.5.28-.7L9.69 2.77a1.01 1.01 0 011.62 0l6.49 7.02c.23.24.28.5.28.7a1.01 1.01 0 01-.28.7l-6.49 7.02c-.09.1-.2.19-.31.23z" clipRule="evenodd" />
                        </svg>
                        {event.location}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {event.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {new Date(event.dateTime) > new Date() ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx={4} cy={4} r={3} />
                          </svg>
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx={4} cy={4} r={3} />
                          </svg>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard