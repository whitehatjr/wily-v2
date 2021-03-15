import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import db from "../config";
export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      searchText: ""
    };
  }
  componentDidMount = async () => {
    this.getTransactions();
  };

  getTransactions = () => {
    db.collection("transactions")
      .limit(10)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc
          });
        });
      });
  };

  handleSearch = async text => {
    var enteredText = text.toUpperCase().split("");
    text = text.toUpperCase();
    this.setState({
      allTransactions: []
    });
    if (!text) {
      this.getTransactions();
    }

    if (enteredText[0] === "B") {
      db.collection("transactions")
        .where("book_id", "==", text)
        .get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()],
              lastVisibleTransaction: doc
            });
          });
        });
    } else if (enteredText[0] === "S") {
      db.collection("transactions")
        .where("student_id", "==", text)
        .get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()],
              lastVisibleTransaction: doc
            });
          });
        });
    }
  };

  fetchMoreTransactions = async text => {
    var enteredText = text.toUpperCase().split("");
    text = text.toUpperCase();

    const { lastVisibleTransaction, allTransactions } = this.state;
    if (enteredText[0] === "B") {
      const query = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .startAfter(lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map(doc => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        });
      });
    } else if (enteredText[0] === "S") {
      const query = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map(doc => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        });
      });
    }
  };

  render() {
    const { searchText, allTransactions } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ searchText: text })}
              placeholder={"Type here"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.handleSearch(searchText)}
            >
              <Text style={styles.scanbuttonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <FlatList
            data={allTransactions}
            renderItem={({ item }) => (
              <View style={{ borderBottomWidth: 2 }}>
                <Text>{"Book Id: " + item.book_id}</Text>
                <Text>{"Student id: " + item.student_id}</Text>
                <Text>{"Transaction Type: " + item.transaction_type}</Text>
                <Text>{"Date: " + item.date.toDate()}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5653D4"
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold"
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 37,
    borderTopLeftRadius: 37
  }
});
