import { HyperSpaceAttributes } from "@/chrome/hyperspace"

export type HSProjectStat = {
  project_id: string,
  floor_price: number
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

export type HSMarketSnapshot = {
  project_id: string
  project_name: string
  name: string,
  meta_data_img: string
  thumbnail: string
  market_place_state: {
    price: number
    block_timestamp: number
  }
  when?: string
}

export type HSProjectHistoryResp = {
  data: {
    getProjectHistory: {
      market_place_snapshots: HSMarketSnapshot[]
    }
  }
}

class HyperSpace {
  baseUrl = 'https://beta.api.solanalysis.com/graphql'

  async getData(query: Record<string, any>) {
    let responseData: any
    try {
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

      return JSON.parse(responseData)
    } catch (err) {
      console.log(err);
      console.log(responseData)
      return null
    }
  }

  async getProjectStats(projectId: string) {
    const query = {
      "operationName": "GetProjectStats",
      "variables": {
        "orderBy": [{ "field_name": "created_at", "sort_order": "DESC" }],
        "conditions": { "is_verified": true, "project_ids": [projectId] },
        "paginationInfo": { "page_size": 1, "progressive_load": true }
      },
      "query": "query GetProjectStats($orderBy: [OrderConfig!], $paginationInfo: PaginationConfig, $conditions: GetProjectStatsCondition) {\n  getProjectStats(\n    order_by: $orderBy\n    pagination_info: $paginationInfo\n    conditions: $conditions\n  ) {\n    project_stats {\n      project_id\n      market_cap\n      volume_1hr\n      volume_1day\n      volume_7day\n      volume_1day_change\n      floor_price\n      floor_price_1day_change\n      average_price\n      average_price_1day_change\n      max_price\n      twitter_followers\n      num_of_token_listed\n      num_of_token_holders\n      percentage_of_token_listed\n      created_at\n      updated_at\n      project {\n        supply\n        website\n        discord\n        twitter\n        img_url\n        is_verified\n        display_name\n        notifi_id\n        lmnft\n        tags {\n          tag\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pagination_info {\n      current_page_number\n      current_page_size\n      has_next_page\n      __typename\n    }\n    __typename\n  }\n}"
    }

    const data = await this.getData(query) as HSProjectStatsResp
    if (!data) return null
    return data.data.getProjectStats.project_stats[0] || null
  }

  async getProjectHistory(projectId: string, attributes: HyperSpaceAttributes, page_number: number, page_size: number) {
    const query = {
      "operationName": "GetProjectMPAHistory",
      "variables": {
        "condition": {
          "projects": [
            {
              "project_id": projectId,
              "attributes": attributes
            }
          ],
          "by_mpa_types": [
            "TRANSACTION"
          ]
        },
        "pagination_info": {
          page_number,
          page_size,
        }
      },
      "query": "query GetProjectMPAHistory($condition: GetMarketPlaceActionsByProjectsCondition!, $pagination_info: MPAPaginationConfig) {\n  getProjectHistory(condition: $condition, pagination_info: $pagination_info) {\n    market_place_snapshots {\n      token_address\n      project_id\n      project_name\n      name\n      owner\n      full_img\n      rank_est\n      moonrank\n      howrare_rank\n      meta_data_img\n      market_place_state {\n        marketplace_program_id\n        marketplace_instance_id\n        type\n        price\n        block_timestamp\n        seller_address\n        seller_referral_address\n        seller_referral_fee\n        signature\n        escrow_address\n        buyer_address\n        buyer_referral_address\n        buyer_referral_fee\n        created_at\n        metadata\n        token_address\n        __typename\n      }\n      __typename\n    }\n    pagination_info {\n      current_page_number\n      current_page_size\n      has_next_page\n      __typename\n    }\n    __typename\n  }\n}"
    }

    const data = await this.getData(query) as HSProjectHistoryResp
    if (!data) return null
    return data.data.getProjectHistory.market_place_snapshots
  }
}

export const hsClient = new HyperSpace()
