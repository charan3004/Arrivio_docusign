import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Users, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Employers = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    relocationsPerYear: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.relocationsPerYear.trim()) {
      newErrors.relocationsPerYear = 'This field is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitted(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const problemSolutions = [
    {
      problem: 'Fragmented Market',
      solution: 'One Verified Partner',
      icon: Shield,
    },
    {
      problem: 'Language Barriers',
      solution: 'English-First Service',
      icon: CheckCircle,
    },
    {
      problem: 'Uncertainty',
      solution: 'Guaranteed Capacity',
      icon: CheckCircle,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'You reserve capacity',
      description: 'Secure housing blocks for your upcoming relocations in advance.',
    },
    {
      number: '02',
      title: 'We prepare the homes',
      description: 'All properties are verified, furnished, and move-in ready.',
    },
    {
      number: '03',
      title: 'Your talent moves in',
      description: 'End-to-end management eliminates paperwork and stress.',
    },
  ];

  const backgroundImage = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1';

  return (
    <div className="min-h-screen bg-softWhite">
      {/* Hero Section */}
      <section className="relative bg-softWhite py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="z-10"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-forestGreen mb-6 leading-tight">
                Secure Housing for Your Global Talent
              </h1>
              <p className="text-xl text-charcoal/80 mb-8 font-body leading-relaxed">
                The end-to-end housing solution for international relocation. Reserve capacity in advance and eliminate the housing bottleneck for your new hires.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" className="px-8 py-4 text-lg">
                  Partner with Us
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Download Case Study
                </Button>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden"
            >
              <img
                src={backgroundImage}
                alt="Professional team meeting"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Grid */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              Why ARRIVIO?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problemSolutions.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-softWhite rounded-lg p-8 border border-warmSand/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-forestGreen/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-forestGreen" size={24} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-charcoal/60 font-body text-sm mb-2">Problem:</p>
                    <h3 className="font-heading font-semibold text-charcoal text-lg mb-3">
                      {item.problem}
                    </h3>
                  </div>
                  <div>
                    <p className="text-charcoal/60 font-body text-sm mb-2">Solution:</p>
                    <p className="font-heading font-semibold text-forestGreen text-lg">
                      {item.solution}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Strip */}
      <section className="bg-warmSand/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-4">
              Trusted by 50+ Companies
            </h2>
            <p className="text-charcoal/70 font-body">
              Leading companies rely on ARRIVIO for their international relocation needs
            </p>
          </motion.div>

          {/* Placeholder Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg h-16 flex items-center justify-center border border-warmSand/50"
              >
                <div className="text-charcoal/40 font-heading font-bold text-sm">
                  Logo {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-softWhite py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              How It Works
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto font-body">
              Our streamlined B2B2C model simplifies international relocation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-warmSand/50 -z-10 transform translate-x-4">
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 text-warmSand" size={20} />
                  </div>
                )}
                <div className="bg-white rounded-lg p-8 border border-warmSand/50 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl font-heading font-bold text-mutedGold">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-charcoal text-xl mb-3">
                        {step.title}
                      </h3>
                      <p className="text-charcoal/70 font-body leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="bg-warmSand/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-warmSand/50"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-forestGreen mb-4">
                Get Started Today
              </h2>
              <p className="text-lg text-charcoal/70 font-body">
                Let's discuss how ARRIVIO can support your international relocation needs
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="mx-auto mb-4 text-forestGreen" size={64} />
                <h3 className="text-2xl font-heading font-bold text-forestGreen mb-2">
                  Thank You!
                </h3>
                <p className="text-charcoal/70 font-body">
                  We'll be in touch soon to discuss your partnership opportunities.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    type="text"
                    name="companyName"
                    placeholder="Acme Corporation"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                  />

                  <Input
                    label="Contact Person"
                    type="text"
                    name="contactPerson"
                    placeholder="John Doe"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    error={errors.contactPerson}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Number of Relocations/Year"
                    type="text"
                    name="relocationsPerYear"
                    placeholder="10-50"
                    value={formData.relocationsPerYear}
                    onChange={handleChange}
                    error={errors.relocationsPerYear}
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                  Request Partnership
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Employers;
