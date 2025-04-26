import { addEventToGoogleCalendar } from '../api/googleCalendarApi';
import { createAsanaTask } from '../api/asanaApi';
import { sendGmailEmail } from '../api/gmailApi';

export default function Integrations() {
  const handleIntegrations = async () => {
    await addEventToGoogleCalendar({ title: 'Test Event', time: 'Tomorrow at 10am' });
    await createAsanaTask('Follow up with client');
    await sendGmailEmail('example@example.com', 'Hello from App', 'This is a test email.');
    alert('Integrations triggered! (Simulated)');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Trigger Integrations</h1>
      <button onClick={handleIntegrations} className="bg-green-600 text-white px-4 py-2 rounded">
        Trigger Now
      </button>
    </div>
  );
}