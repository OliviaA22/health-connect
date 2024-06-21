
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/style.module.css';


interface FormData {
    title: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email: string;
    password: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
    };
    accessibility_needs: string;
    emergency_contact_details: {
      name: string;
      relationship: string;
      phone_number: string;
    };
  }

 
export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
      title: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone_number: '',
      email: '',
      password: '',
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
      },
      accessibility_needs: '',
      emergency_contact_details: {
        name: '',
        relationship: '',
        phone_number: '',
      },
    });
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prevState => ({
          ...prevState,
          [parent]: {
            ...prevState[parent as keyof FormData],
            [child]: value,
          },
        }));
      } else {
        setFormData(prevState => ({ ...prevState, [name]: value }));
      }
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch('https://health-connect-kyp7.onrender.com/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          // Registration successful, redirect to login page
          router.push('/user/login');
        } else {
          // Handle errors
          console.error('Registration failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const renderStep1 = () => (
      <>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">Select a title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="first_name" className={styles.label}>First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="last_name" className={styles.label}>Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="date_of_birth" className={styles.label}>Date of Birth</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone_number" className={styles.label}>Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <button onClick={() => setStep(2)} className={styles.button}>Next</button>
      </>
    );
  
    const renderStep2 = () => (
      <>
        <div className={styles.formGroup}>
          <label htmlFor="street" className={styles.label}>Street</label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city" className={styles.label}>City</label>
          <input
            type="text"
            id="city"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="state" className={styles.label}>State</label>
          <input
            type="text"
            id="state"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="postal_code" className={styles.label}>Postal Code</label>
          <input
            type="text"
            id="postal_code"
            name="address.postal_code"
            value={formData.address.postal_code}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="accessibility_needs" className={styles.label}>Accessibility Needs</label>
          <input
            type="text"
            id="accessibility_needs"
            name="accessibility_needs"
            value={formData.accessibility_needs}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="emergency_contact_name" className={styles.label}>Emergency Contact Name</label>
          <input
            type="text"
            id="emergency_contact_name"
            name="emergency_contact_details.name"
            value={formData.emergency_contact_details.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="emergency_contact_relationship" className={styles.label}>Emergency Contact Relationship</label>
          <input
            type="text"
            id="emergency_contact_relationship"
            name="emergency_contact_details.relationship"
            value={formData.emergency_contact_details.relationship}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="emergency_contact_phone" className={styles.label}>Emergency Contact Phone</label>
          <input
            type="tel"
            id="emergency_contact_phone"
            name="emergency_contact_details.phone_number"
            value={formData.emergency_contact_details.phone_number}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <button onClick={() => setStep(1)} className={styles.button}>Previous</button>
        <button type="submit" className={styles.button}>Register</button>
      </>
    );
  
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Register</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    );
  }