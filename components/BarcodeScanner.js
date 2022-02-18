import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner, requestPermissionsAsync } from "expo-barcode-scanner";

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");

  const askForCameraPermission = () => {
    BarCodeScanner.requestPermissionsAsync().then((result) => {
      console.log(result.status);
      if (result.status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    });
  };

  // const askForCameraPermission = () => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log(data);
  };

  const resetScanner = () => {
    setScanned(false);
    setText("");
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Need to request permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No permission</Text>
        <Button
          title="Allow camera permission"
          onPress={() => {
            askForCameraPermission();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 400, width: 400 }}
      />
      <Text>ISBN: {text}</Text>
      {scanned && (
        <Button title={"Scan again"} onPress={() => resetScanner()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
