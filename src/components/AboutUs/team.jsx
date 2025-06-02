'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Team() {
  const [team, setTeam] = useState([])

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/team/getteam`,
          { withCredentials: true }
        )
        setTeam(response.data)
      } catch (err) {
        console.error('Error fetching team:', err)
      }
    }

    fetchTeam()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {team.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center transition-transform hover:scale-105">
            <img
              src={member.image}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full shadow-lg"
            />
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.designation}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
