import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ListView, PullToRefresh, WhiteSpace } from 'antd-mobile'
import HomeRecruitCard from '../HomeRecruitCard'

export default class HomeRecruitOrderListView extends PureComponent {
  constructor(props) {
    super(props)
    this.onEndReached = this.onEndReached.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }

  onEndReached = event => {
    if (
      this.props.recruitOrder.isFetching ||
      !this.props.recruitOrder.isLoadMore
    ) {
      return
    }
    const page = this.props.recruitOrder.page + 1
    this.props.getHomeRecruitOrderList({ page: page })
  }

  onRefresh = () => {
    this.props.getHomeRecruitOrderList({ isRefreshing: true })
  }

  render() {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }).cloneWithRows(this.props.recruitOrder.list)
    const separator = (sectionID, rowID) => <WhiteSpace key={`${rowID}`} />
    const row = (rowData, sectionID, rowID) => {
      return (
        <HomeRecruitCard
          key={rowData.objectId}
          item={rowData}
          navigateTo={this.props.navigateTo}
        />
      )
    }
    const fonter = () => {
      return (
        <div style={{ padding: 5, textAlign: 'center' }}>
          {this.props.recruitOrder.isFetching ? '' : '到底了'}
        </div>
      )
    }
    return (
      <ListView
        dataSource={dataSource}
        renderFooter={fonter}
        renderRow={row}
        renderSeparator={separator}
        initialListSize={20}
        pageSize={20}
        style={{
          height: '100%',
          overflow: 'auto'
        }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={100}
        pullToRefresh={
          <PullToRefresh
            refreshing={this.props.recruitOrder.isRefreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    )
  }
}

HomeRecruitOrderListView.propTypes = {
  recruitOrder: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  getHomeRecruitOrderList: PropTypes.func.isRequired
}
