import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setStatus("Please enter a valid email.");
      return;
    }

    try {
      // Simulated API POST request (replace with real endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setStatus("Something went wrong. Try again later.", error);
    }
  };

  return (
    <div className="bg-base-200 py-10 px-4 sm:px-8 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
        Subscribe to our Newsletter
      </h2>
      <p className="text-gray-500 mb-6">
        Get the latest blogs and updates delivered to your inbox
      </p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full sm:w-80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          Subscribe
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default Newsletter;
