import { useState } from 'react';
import '../styles/weektask.css';
import axios from 'axios';

export function WeekTaskInfoCreate() {

  const [name, setName] = useState('');
  const [taskinfo, setTaskInfo] = useState('');

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleTaskInfoChange = (e) => {
    const { value } = e.target;
    setTaskInfo(value);
  };

  console.log("Name:", name);
  console.log("Task Info:", taskinfo);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/createtaskinfo', {
        name,
        taskinfo,
      });

      const data = response.data;
      console.log("Task:", data);

      // Assuming the response contains task information and you want to store it in the state
      setTaskInfo(data.description);

    } catch (error) {
      // Handle API call error
      console.error('API Call Error:', error);
    }
  };

  return (
    <div className="weektaskinfo">
      <h1 id="title">Weekly Task Information</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type='text' name='name' value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Task Description:
          <textarea
            rows="10"
            cols="100"
            value={taskinfo}
            onChange={handleTaskInfoChange}
            placeholder="Enter task description"
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>Name: {name}</p>
      <p>Task Description: {taskinfo}</p>
    </div>
  );
}
