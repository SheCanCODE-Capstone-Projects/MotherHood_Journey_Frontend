"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/components/layout";
import { 
  Heart, 
  Baby, 
  Shield, 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Users,
  Lightbulb,
  ChevronRight,
  Star
} from "lucide-react";

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("pregnancy");

  const categories = [
    { id: "pregnancy", label: "Pregnancy Care", icon: Heart, color: "bg-pink-500" },
    { id: "child", label: "Child Health", icon: Baby, color: "bg-blue-500" },
    { id: "emergency", label: "Emergency Care", icon: AlertTriangle, color: "bg-red-500" }
  ];

  const pregnancyTips = [
    {
      id: 1,
      title: "Prenatal Nutrition Essentials",
      description: "Eat a balanced diet rich in folic acid, iron, and calcium. Include fruits, vegetables, whole grains, and lean proteins.",
      icon: Heart,
      priority: "high",
      tips: [
        "Take prenatal vitamins daily",
        "Eat 5-6 small meals throughout the day",
        "Drink at least 8 glasses of water daily",
        "Avoid alcohol, smoking, and raw foods"
      ]
    },
    {
      id: 2,
      title: "Regular Prenatal Checkups",
      description: "Attend all scheduled appointments with your healthcare provider to monitor your baby's development.",
      icon: Stethoscope,
      priority: "high",
      tips: [
        "Schedule monthly visits in first 28 weeks",
        "Bi-weekly visits from 28-36 weeks",
        "Weekly visits after 36 weeks",
        "Don't miss any ultrasound appointments"
      ]
    },
    {
      id: 3,
      title: "Safe Exercise During Pregnancy",
      description: "Stay active with gentle exercises approved by your doctor to maintain health and prepare for delivery.",
      icon: Shield,
      priority: "medium",
      tips: [
        "Walk for 30 minutes daily",
        "Practice prenatal yoga",
        "Do pelvic floor exercises",
        "Avoid contact sports and heavy lifting"
      ]
    },
    {
      id: 4,
      title: "Mental Health & Rest",
      description: "Take care of your emotional well-being and get adequate rest throughout your pregnancy.",
      icon: Heart,
      priority: "medium",
      tips: [
        "Sleep 7-9 hours per night",
        "Practice relaxation techniques",
        "Talk to family and friends for support",
        "Join pregnancy support groups"
      ]
    }
  ];

  const childHealthTips = [
    {
      id: 1,
      title: "Vaccination Schedule",
      description: "Follow the complete immunization schedule to protect your child from preventable diseases.",
      icon: Shield,
      priority: "high",
      tips: [
        "BCG vaccine at birth",
        "Polio and Pentavalent at 6, 10, 14 weeks",
        "Measles vaccine at 9 months",
        "Keep vaccination card safe"
      ]
    },
    {
      id: 2,
      title: "Breastfeeding Benefits",
      description: "Exclusive breastfeeding for the first 6 months provides the best nutrition for your baby.",
      icon: Heart,
      priority: "high",
      tips: [
        "Start breastfeeding within 1 hour of birth",
        "Feed on demand, 8-12 times per day",
        "No water or other foods before 6 months",
        "Continue breastfeeding up to 2 years"
      ]
    },
    {
      id: 3,
      title: "Growth Monitoring",
      description: "Regular weight and height checks ensure your child is growing properly.",
      icon: Baby,
      priority: "medium",
      tips: [
        "Monthly weight checks in first year",
        "Plot growth on the growth chart",
        "Watch for developmental milestones",
        "Report any concerns to CHW"
      ]
    },
    {
      id: 4,
      title: "Hygiene & Safety",
      description: "Maintain good hygiene practices to prevent infections and keep your child safe.",
      icon: Shield,
      priority: "medium",
      tips: [
        "Wash hands before handling baby",
        "Keep baby's environment clean",
        "Use safe sleeping practices",
        "Childproof your home as baby grows"
      ]
    }
  ];

  const emergencyTips = [
    {
      id: 1,
      title: "When to Contact CHW Immediately",
      description: "Recognize warning signs that require immediate attention from your Community Health Worker.",
      icon: Phone,
      priority: "high",
      tips: [
        "Severe headaches or blurred vision",
        "Heavy bleeding during pregnancy",
        "Baby not moving for 12+ hours",
        "High fever (38°C or higher)"
      ]
    },
    {
      id: 2,
      title: "Hospital Emergency Signs",
      description: "These symptoms require immediate hospital care - don't wait.",
      icon: AlertTriangle,
      priority: "high",
      tips: [
        "Severe abdominal pain",
        "Difficulty breathing",
        "Continuous vomiting",
        "Signs of labor before 37 weeks"
      ]
    },
    {
      id: 3,
      title: "Child Emergency Symptoms",
      description: "Watch for these warning signs in your child that need immediate medical attention.",
      icon: Baby,
      priority: "high",
      tips: [
        "Difficulty breathing or fast breathing",
        "High fever with convulsions",
        "Severe diarrhea or dehydration",
        "Unusual drowsiness or irritability"
      ]
    }
  ];

  const getCurrentTips = () => {
    switch (activeCategory) {
      case "pregnancy": return pregnancyTips;
      case "child": return childHealthTips;
      case "emergency": return emergencyTips;
      default: return pregnancyTips;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Health Tips & Guidance"
        subtitle="Essential advice for mothers and child health - Contact your CHW for personalized support"
      />

      {/* Contact CHW Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg animate-slideUp">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Need Personal Guidance?</h3>
              <p className="text-teal-100 text-sm">Your Community Health Worker is here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-teal-700 px-4 py-2 rounded-full font-semibold hover:bg-teal-50 transition-colors">
              <Phone className="w-4 h-4" />
              Contact CHW
            </button>
            <button className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-colors">
              <MapPin className="w-4 h-4" />
              Find Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isActive 
                  ? "bg-white text-gray-900 shadow-sm transform scale-105" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : ''}`} />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getCurrentTips().map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div 
              key={tip.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{tip.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(tip.priority)}`}>
                      {tip.priority === 'high' ? 'Important' : 'Helpful'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {tip.tips.map((tipItem, tipIndex) => (
                  <div key={tipIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{tipItem}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm group">
                  <Lightbulb className="w-4 h-4" />
                  Learn More
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 text-lg">Emergency Contacts</h3>
            <p className="text-red-700 text-sm">Save these numbers for urgent situations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-900">Emergency Hotline</span>
            </div>
            <p className="text-2xl font-bold text-red-600">912</p>
            <p className="text-xs text-red-700">24/7 Emergency Services</p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-900">Community Health Worker</span>
            </div>
            <p className="text-lg font-bold text-red-600">Contact Your CHW</p>
            <p className="text-xs text-red-700">Local health support</p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-900">Nearest Hospital</span>
            </div>
            <p className="text-lg font-bold text-red-600">Find Location</p>
            <p className="text-xs text-red-700">Emergency care facility</p>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-yellow-500" />
          <h3 className="font-bold text-green-900 text-lg">Success Story</h3>
        </div>
        <blockquote className="text-green-800 italic mb-3">
          "Following the pregnancy tips and staying in touch with my CHW helped me have a healthy baby. The vaccination reminders were especially helpful!"
        </blockquote>
        <p className="text-sm text-green-700 font-semibold">- Marie, Mother from Kigali</p>
      </div>
    </div>
  );
}
