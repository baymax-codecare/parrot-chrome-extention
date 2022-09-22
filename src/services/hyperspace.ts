
export type HSProjectStat = {
  project_id: string,
  flood_price: number
  project: {
    img_url: string
    display_name: string
  }
}

export type HSProjectStatsResp = {
  data: {
    getProjectStats: {
      project_stats: HSProjectStat[]
    }
  }
}

class HyperSpace {
  baseUrl = 'https://beta.api.solanalysis.com/graphql'

  async getProjectStats(projectId: string) {
    let responseData: any
    try {
      const query = {
        "operationName": "GetProjectStats",
        "variables": {
          "orderBy": [{ "field_name": "created_at", "sort_order": "DESC" }],
          "conditions": { "is_verified": true, "project_ids": [projectId] },
          "paginationInfo": { "page_size": 1, "progressive_load": true }
        },
        "query": "query GetProjectStats($orderBy: [OrderConfig!], $paginationInfo: PaginationConfig, $conditions: GetProjectStatsCondition) {\n  getProjectStats(\n    order_by: $orderBy\n    pagination_info: $paginationInfo\n    conditions: $conditions\n  ) {\n    project_stats {\n      project_id\n      market_cap\n      volume_1hr\n      volume_1day\n      volume_7day\n      volume_1day_change\n      floor_price\n      floor_price_1day_change\n      average_price\n      average_price_1day_change\n      max_price\n      twitter_followers\n      num_of_token_listed\n      num_of_token_holders\n      percentage_of_token_listed\n      created_at\n      updated_at\n      project {\n        supply\n        website\n        discord\n        twitter\n        img_url\n        is_verified\n        display_name\n        notifi_id\n        lmnft\n        tags {\n          tag\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pagination_info {\n      current_page_number\n      current_page_size\n      has_next_page\n      __typename\n    }\n    __typename\n  }\n}"
      }

      responseData = await (await fetch(
        this.baseUrl,
        {
          method: 'POST',
          body: JSON.stringify(query),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )).text()

      const data = JSON.parse(responseData) as HSProjectStatsResp;
      return data.data.getProjectStats.project_stats[0] || null
    } catch (err) {
      console.log(err);
      console.log(responseData)
      return null
    }
  }
}

export const hsClient = new HyperSpace()
