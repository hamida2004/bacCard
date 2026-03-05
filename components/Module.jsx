import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import { useRouter } from 'expo-router'

const Module = ({name,id,color}) => {
      const router = useRouter();
    
  return (
     <Pressable
           style={{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            borderRadius:4,
            elevation:2,
            backgroundColor: color,
            margin:20,
            width:"100%",
            minHeight:120
    
           }}
          onPress={()=>{
            router.push(`./Cards?id=${id}`)

          }
          }
          >
          <Text
          style={{
            color:"white",
            textAlign:'center'
          }}
          >
            {name}
          </Text>
          </Pressable>
  )
}

export default Module

const styles = StyleSheet.create({})