import React, { useContext } from 'react';
import { X } from 'lucide-react';
import CycleContext from '../../context/CycleContext';

const InfoModal = () => {
  const { setShowInfoModal, userSettings } = useContext(CycleContext);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 text-black border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Menstrual Cycle Information</h2>
          <button onClick={() => setShowInfoModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 text-black">
          <h3 className="font-bold text-lg mb-2">Typical Menstrual Cycle</h3>
          <p className="mb-4">
            The average menstrual cycle lasts 28 days, but can range from 21 to 35 days. 
            The cycle is counted from the first day of one period to the first day of the next.
          </p>
          
          <h3 className="font-bold text-lg mb-2">Cycle Phases</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <span className="font-medium">Menstrual phase (days 1-5):</span> When 
              the uterine lining sheds, causing bleeding.
            </li>
            <li>
              <span className="font-medium">Follicular phase (days 1-13):</span> When 
              an egg matures in preparation for release.
            </li>
            <li>
              <span className="font-medium">Ovulation (around day 14):</span> When 
              a mature egg is released from the ovary.
            </li>
            <li>
              <span className="font-medium">Luteal phase (days 15-28):</span> After 
              ovulation, the body prepares for potential pregnancy.
            </li>
          </ul>
          
          <h3 className="font-bold text-lg mb-2">Common Symptoms</h3>
          <p className="mb-4">
            PMS symptoms can include mood changes, breast tenderness, fatigue, and food cravings.
            These typically occur 1-2 weeks before your period starts.
          </p>
          
          <h3 className="font-bold text-lg mb-2">Cervical Fluid Types</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <span className="font-medium">Dry:</span> Little to no discharge, typically less fertile.
            </li>
            <li>
              <span className="font-medium">Sticky:</span> Thick, opaque, and doesn't stretch much; low fertility.
            </li>
            <li>
              <span className="font-medium">Creamy:</span> Lotion-like consistency, white or yellowish; moderate fertility.
            </li>
            <li>
              <span className="font-medium">Egg White:</span> Clear, stretchy, slippery; indicates high fertility.
            </li>
            <li>
              <span className="font-medium">Watery:</span> Clear, thin, and slippery; indicates high fertility.
            </li>
          </ul>
          
          <h3 className="font-bold text-lg mb-2">Basal Body Temperature (BBT)</h3>
          <p className="mb-4">
            BBT is your body's temperature at complete rest. It typically rises about 0.2-0.5°C (0.4-1.0°F) 
            after ovulation and remains elevated until your next period. Track your temperature first thing 
            in the morning before getting out of bed for the most accurate readings.
          </p>
          
          {(userSettings.inPerimenopause || userSettings.age >= 40) && (
            <>
              <h3 className="font-bold text-lg mb-2">Perimenopause</h3>
              <p className="mb-4">
                Perimenopause is the transition period before menopause, typically beginning in your 40s. 
                Signs include irregular periods, changes in flow, hot flashes, sleep problems, mood changes, 
                and vaginal dryness. This phase can last 4-8 years.
              </p>
            </>
          )}
          
          {userSettings.inMenopause && (
            <>
              <h3 className="font-bold text-lg mb-2">Menopause</h3>
              <p className="mb-4">
                Menopause is officially diagnosed after 12 consecutive months without a period. Common symptoms 
                include hot flashes, night sweats, sleep disruption, mood changes, and vaginal dryness. 
                Hormone levels continue to change during this time.
              </p>
            </>
          )}
          
          <h3 className="font-bold text-lg mb-2">When to See a Doctor</h3>
          <p>
            Consult a healthcare provider if you experience very heavy bleeding, severe pain, 
            irregular cycles, or if your cycle suddenly changes significantly.
          </p>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowInfoModal(false)}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;