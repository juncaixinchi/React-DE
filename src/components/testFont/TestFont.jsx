import React from 'react'

export default class TestFont extends React.Component {
  render() {
    const FontSize = [11, 13, 20, 24]
    const FontWeight = [300, 400, 500, 700]
    const FontFamily = ['Roboto, "Noto Sans SC" , sans-serif']
    // const FontWeight = [100, 300, 400, 500, 700, 900, 'normal', 'medium', 'regular', 'bold', 'bolder', 'lighter']
    // const FontFamily = ['Roboto', 'Noto Sans SC', 'Roboto, "Noto Sans SC" , sans-serif']
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }} >
        {
          FontSize.map(fontSize => (
          FontWeight.map(fontWeight => (
          FontFamily.map(fontFamily => (
            <div style={{ fontSize, fontWeight, fontFamily }}>
              fontSize: {`${fontSize}`}, fontWeight: {`${fontWeight}`}, fontFamily: {`${fontFamily}`}
              <br />
              两个黄鹂鸣翠柳，一行白鹭上青天, I Have a Dream , artin Luther King Jr.  大小: 2000 KB !@#%^*+_=
              <br />
              <br />
            </div>
          ))))))
        }
      </div>
    )
  }
}
