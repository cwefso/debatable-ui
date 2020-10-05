import { useState, useEffect } from 'react'

const useTopic = () => {
  const [topic, setTopic] = useState([])

  useEffect(() => {
    const loadTopic = () => {
      fetch('http://localhost:8000/api/v1/topics')
        .then((res) => res.json())
        .then((result) => setTopic(result.topics))
        .catch((err) => console.log(err.message))
    }

    loadTopic()
  }, [])

  return topic
}

export default useTopic
