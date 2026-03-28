import EmailForm from "../components/EmailForm";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        AI Email Triage System
      </h1>

      <EmailForm />
      <Dashboard />
    </div>
  );
};

export default Home;