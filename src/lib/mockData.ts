
import { EmergencyEntry } from "../hooks/useEmergencyData";

export const mockUserHistory: EmergencyEntry[] = [
  {
    id: "1",
    timestamp: "2023-05-15T09:23:15.000Z",
    emergency: "child with high fever",
    guidance: "For a child with high fever, give appropriate dose of children's acetaminophen or ibuprofen. Use a lukewarm cloth to sponge their forehead, armpits, and groin. Keep them hydrated with small sips of water. Dress them in light clothing and keep room temperature comfortable. Seek medical attention if fever is over 102.2°F (39°C), lasts more than 2-3 days, or if the child shows symptoms like lethargy, severe headache, stiff neck, or difficulty breathing."
  },
  {
    id: "2",
    timestamp: "2023-06-22T14:05:33.000Z",
    emergency: "sprained ankle",
    guidance: "For a sprained ankle, remember RICE: Rest the ankle, Ice for 20 minutes every 2-3 hours, Compress with an elastic bandage, and Elevate the foot above heart level when possible. Take over-the-counter pain relievers if needed. Avoid putting weight on the injured foot. If you can't bear weight, have severe pain, or see significant swelling or bruising, seek medical attention to rule out a fracture."
  },
  {
    id: "3",
    timestamp: "2023-08-07T18:41:09.000Z",
    emergency: "bee sting",
    guidance: "For a bee sting, first remove the stinger if visible by scraping it out with a card edge (don't use tweezers). Clean the area with soap and water. Apply ice wrapped in cloth for 10 minutes to reduce pain and swelling. Take an antihistamine or use hydrocortisone cream if itching persists. Watch for signs of severe allergic reaction like difficulty breathing, swelling of face or throat, rapid heartbeat, dizziness, or hives away from the sting site - these require immediate emergency care."
  },
  {
    id: "4",
    timestamp: "2023-10-11T07:19:27.000Z",
    emergency: "nosebleed",
    guidance: "For a nosebleed, have the person sit upright and lean slightly forward to prevent blood from running down the throat. Apply firm pressure by pinching the soft part of the nose just below the bridge for 10-15 minutes continuously. Breathe through the mouth and stay calm. Apply a cold compress to the bridge of the nose. If bleeding doesn't stop after 20 minutes, or if it follows a head injury, seek medical attention."
  },
  {
    id: "5",
    timestamp: "2023-12-03T21:05:47.000Z",
    emergency: "choking",
    guidance: "If someone is choking and can't speak, cough, or breathe, stand behind them and wrap your arms around their waist. Make a fist with one hand and place it just above their navel. Grab your fist with your other hand and pull inward and upward with quick, forceful thrusts. Continue until the object is expelled or the person becomes unconscious. If they become unconscious, begin CPR immediately and call emergency services."
  }
];
