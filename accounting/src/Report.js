import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function Report() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase.from('activities').select('*');
      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data);
      }
    };
    fetchActivities();
  }, []);

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            activity: selectedActivity,
            amount,
            description,
            created_at: new Date(),
          },
        ]);

      if (error) throw error;
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div>
      <h2>Submit Report</h2>
      <select onChange={(e) => setSelectedActivity(e.target.value)} value={selectedActivity}>
        <option value="">Select Activity</option>
        {activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Report</button>
    </div>
  );
}

export default Report;
