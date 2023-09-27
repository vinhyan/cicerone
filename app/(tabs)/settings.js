import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  TouchableHighlight,
} from "react-native";
import Communications from "react-native-communications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [weight, setWeight] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isWeightInPounds, setIsWeightInPounds] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { prefix: "+1", number: "" },
    { prefix: "+1", number: "" },
  ]);
  const [intoxicationLimit, setIntoxicationLimit] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("g/L");

  const loadSettings = async () => {
    const settings = await AsyncStorage.getItem("settings");
    if (settings !== null) {
      const parsedSettings = JSON.parse(settings);
      setWeight(parsedSettings.weight);
      setSelectedGender(parsedSettings.gender);
      setEmergencyContacts(parsedSettings.emergencyContacts);
      setIntoxicationLimit(parsedSettings.intoxicationLimit);
      setSelectedUnit(parsedSettings.selectedUnit);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = () => {
    let convertedWeight = weight;

    if (isWeightInPounds) {
      convertedWeight = parseFloat(weight) * 0.45359237;
    }

    const settings = {
      weight: convertedWeight,
      gender: selectedGender,
      emergencyContacts,
      intoxicationLimit,
      unit: selectedUnit,
    };

    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem("settings", JSON.stringify(settings));
      } catch (e) {
        console.log(e);
      }
    };

    saveSettings();

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSelectMale = () => {
    if (isEditing) {
      setSelectedGender("Male");
    }
  };

  const handleSelectFemale = () => {
    if (isEditing) {
      setSelectedGender("Female");
    }
  };

  const handleSelectNotSpecified = () => {
    if (isEditing) {
      setSelectedGender("Not specified");
    }
  };

  const handlePrefixChange = (index, value) => {
    if (isEditing) {
      const updatedContacts = [...emergencyContacts];
      updatedContacts[index].prefix = value;
      setEmergencyContacts(updatedContacts);
    }
  };

  const handleNumberChange = (index, value) => {
    if (isEditing) {
      const updatedContacts = [...emergencyContacts];
      updatedContacts[index].number = value;
      setEmergencyContacts(updatedContacts);
    }
  };

  const callNumber = (number) => {
    Communications.phonecall(number, true);
  };

  const handleCallContact = (number) => {
    callNumber(number);
    console.log("Calling", number);
  };

  const handleEmergencyCall = (number) => {
    callNumber(number);
    console.log("Calling emergency number:", number);
  };

  const handleSelectGramsPerLiter = () => {
    if (isEditing) {
      setSelectedUnit("g/L");
    }
  };

  const handleSelectPercentage = () => {
    if (isEditing) {
      setSelectedUnit("%");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your settings</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          placeholder={isWeightInPounds ? "Weight (lbs)" : "Weight (kg)"}
          placeholderTextColor={"black"}
          value={weight}
          onChangeText={setWeight}
          editable={isEditing}
        />
        <Switch
          value={isWeightInPounds}
          onValueChange={setIsWeightInPounds}
          disabled={!isEditing}
          thumbColor="#ccc"
          trackColor={{ false: "#e1e1e1", true: "#e1e1e1" }}
        />
      </View>
      <View style={styles.genderContainer}>
        <Text style={styles.genderText}>Gender:</Text>
        <View style={styles.genderButtonsContainer}>
          <TouchableHighlight
            style={[
              styles.genderButton,
              selectedGender === "Male" && styles.selectedGenderButton,
            ]}
            onPress={handleSelectMale}
            underlayColor="#ccc"
          >
            <Text style={styles.genderButtonText}>Male</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[
              styles.genderButton,
              selectedGender === "Female" && styles.selectedGenderButton,
            ]}
            onPress={handleSelectFemale}
            underlayColor="#ccc"
          >
            <Text style={styles.genderButtonText}>Female</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[
              styles.genderButton,
              selectedGender === "Not specified" && styles.selectedGenderButton,
            ]}
            onPress={handleSelectNotSpecified}
            underlayColor="#ccc"
          >
            <Text style={styles.genderButtonText}>Not specified</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style={styles.emergencyContactsContainer}>
        <Text style={styles.emergencyContactsTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <View style={styles.emergencyContactRow} key={index}>
            <TextInput
              style={[styles.prefixInput, !isEditing && styles.disabledInput]}
              placeholder="Prefix"
              value={contact.prefix}
              onChangeText={(value) => handlePrefixChange(index, value)}
              editable={isEditing}
            />
            <TextInput
              style={[styles.numberInput, !isEditing && styles.disabledInput]}
              placeholder="Number"
              value={contact.number}
              onChangeText={(value) => handleNumberChange(index, value)}
              editable={isEditing}
            />
            <Button
              title="Call"
              onPress={() => handleCallContact(contact.prefix + contact.number)}
              disabled={!contact.prefix || !contact.number}
            />
          </View>
        ))}
      </View>
      <View style={styles.unitSelectionContainer}>
        <Text style={styles.unitSelectionTitle}>Intoxication Limit</Text>
        <View style={styles.unitSelectionInputContainer}>
          <TextInput
            style={[
              styles.input,
              !isEditing && styles.disabledInput,
              styles.unitSelectionInput,
            ]}
            placeholder="Intoxication Limit"
            value={intoxicationLimit}
            onChangeText={setIntoxicationLimit}
            editable={isEditing}
          />
          <View style={styles.unitSelectionButtonsContainer}>
            <TouchableHighlight
              style={[
                styles.unitSelectionButton,
                selectedUnit === "g/L" && styles.selectedUnitSelectionButton,
              ]}
              onPress={handleSelectGramsPerLiter}
              underlayColor="#ccc"
            >
              <Text style={styles.unitSelectionButtonText}>Grams/L</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[
                styles.unitSelectionButton,
                selectedUnit === "%" && styles.selectedUnitSelectionButton,
              ]}
              onPress={handleSelectPercentage}
              underlayColor="#ccc"
            >
              <Text style={styles.unitSelectionButtonText}>‰</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.emergencyCallButton}
          onPress={() => handleEmergencyCall("911")}
          underlayColor="#FF0000"
        >
          <Text style={styles.emergencyCallButtonText}>Call 911</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.emergencyCallButton}
          onPress={() => handleEmergencyCall("112")}
          underlayColor="#FF0000"
        >
          <Text style={styles.emergencyCallButtonText}>Call 112</Text>
        </TouchableHighlight>
      </View>
      {!isEditing && <Button title="Edit Info" onPress={handleEdit} />}
      {isEditing && <Button title="Save" onPress={handleSave} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "grey",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  disabledInput: {
    backgroundColor: "#f2f2f2",
    color: "black",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  genderText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  genderButtonsContainer: {
    flexDirection: "row",
  },
  genderButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
  },
  selectedGenderButton: {
    backgroundColor: "#FCA311",
  },
  genderButtonText: {
    fontSize: 16,
  },
  emergencyContactsContainer: {
    marginTop: 20,
  },
  emergencyContactsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emergencyContactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  prefixInput: {
    height: 40,
    width: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  numberInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  emergencyCallButton: {
    width: 120,
    height: 40,
    backgroundColor: "#d81832",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 5,
  },
  emergencyCallButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  unitSelectionContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 20,
  },
  unitSelectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  unitSelectionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  unitSelectionInput: {
    flex: 1,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  unitSelectionButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  unitSelectionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
  },
  selectedUnitSelectionButton: {
    backgroundColor: "#FCA311",
  },
  unitSelectionButtonText: {
    fontSize: 16,
  },
});
