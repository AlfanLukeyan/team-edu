import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

export default class ClassCard extends Component {
  render() {
    return (
        <ThemedView style={{ padding: 20 }} isCard>
            <ThemedText>
                Classes Card
            </ThemedText>
        </ThemedView>
    )
  }
}

const styles = StyleSheet.create({

})