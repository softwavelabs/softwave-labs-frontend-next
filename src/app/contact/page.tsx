// components/ContactForm.tsx
import React from "react";


const ContactForm: React.FC = () => {
    return (
        <div className="">
            {/* Replace OfferAnimation with a React equivalent if needed */}
            <div className="text-center py-10">
                <h1 className="text-[4vh] font-bold rotate-0 animate-[yourAnimation_2s] text-black dark:text-white">
                    Contact Us
                </h1>
            </div>

            <section className="bg-gray-50 dark:bg-gray-900 p-10">
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md mb-16">
                    <form
                        action="https://formsubmit.co/softwavelabs@protonmail.com"
                        method="POST"
                        className="space-y-8"
                    >
                        {/* Hidden Fields */}
                        <input type="hidden" name="_next" value="/thank-you" />
                        <input type="hidden" name="_captcha" value="true" />
                        <input type="hidden" name="_subject" value="New Message from Website" />
                        <input type="hidden" name="_message" value="Thank you! Your message has been sent successfully." />

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm uppercase font-bold text-gray-900 dark:text-gray-300"
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="name@email.com"
                                required
                                className="shadow-sm bg-gray-50 border-4 border-black text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                        </div>

                        {/* Subject Field */}
                        <div>
                            <label
                                htmlFor="subject"
                                className="block mb-2 text-sm uppercase font-bold text-gray-900 dark:text-gray-300"
                            >
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                placeholder="Let us know how we can help you"
                                required
                                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 border-4 border-black shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label
                                htmlFor="message"
                                className="block mb-2 text-sm uppercase font-bold text-gray-900 dark:text-gray-400"
                            >
                                Your message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                rows={6}
                                placeholder="Leave a message..."
                                required
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 shadow-sm border-4 border-black focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="border-4 border-black bg-black text-white rounded py-2 px-4 mt-10 hover:bg-transparent hover:text-black transition duration-300"
                        >
                            Send message
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactForm;
