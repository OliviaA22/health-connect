import React from 'react'
interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
  }
  
  interface Location {
    type: string;
    coordinates: [number, number];
  }
  
  interface EmergencyContactDetails {
    name: string;
    relationship: string;
    phone_number: string;
  }
  
  interface User {
    id: number;
    title: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email: string;
    password: string;
    address: Address;
    location: Location;
    accessibility_needs: string;
    emergency_contact_details: EmergencyContactDetails;
    languages: number[];
  }


const UsersPages = async () => {
    const res = await fetch('https://health-connect-kyp7.onrender.com/api/users');
    const users: User[] = await res.json();
  return (
    // <>
    // <h1>Users</h1>
    //     <ul>
    //         {users.map(user => <li key={user.id}>
    //             <div>
    //           <strong>{user.title} {user.first_name} {user.last_name}</strong>
    //           <p>Date of Birth: {user.date_of_birth}</p>
    //           <p>Phone: {user.phone_number}</p>
    //           <p>Email: {user.email}</p>
    //           <p>Address: {user.address.street}, {user.address.city}, {user.address.state}, {user.address.postal_code}</p>
    //           <p>Location: {user.location.coordinates.join(', ')}</p>
    //           <p>Accessibility Needs: {user.accessibility_needs}</p>
    //           <p>Emergency Contact: {user.emergency_contact_details.name} ({user.emergency_contact_details.relationship}), {user.emergency_contact_details.phone_number}</p>
    //           <p>preferred Languages: {user.languages.join(', ')}</p>
    //         </div>
    //             </li>)}
    //     </ul>
    // </>
    <h1>Hi</h1>
  )
}

export default UsersPages