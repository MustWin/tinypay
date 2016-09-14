package oracles

import "fmt"

const (
	EthLatest           = "latest"
	EthNewFilter        = "eth_newFilter"
	EthNewBlockFilter   = "eth_newBlockFilter"
	EthGetFilterChanges = "eth_getFilterChanges"
)

var (
	requestID = 0 //NB: not thread safe
)

type LogEvent struct {
	Removed          bool     `json:"removed,omitempty"`
	LogIndex         string   `json:"logIndex,omitempty"`
	BlockNumber      string   `json:"blockNumber,omitempty"`
	BlockHash        string   `json:"blockHash,omitempty"`
	TransactionHash  string   `json:"transactionHash,omitempty"`
	TransactionIndex string   `json:"transactionIndex,omitempty"`
	Address          string   `json:"address,omitempty"`
	Data             string   `json:"data,omitempty"`
	Topics           []string `json:"topics,omitempty"`
}

func NewBlockFilter() interface{} {
	requestID++
	return &filterRequest{
		ID:     fmt.Sprintf("block_%d", requestID),
		Method: EthNewBlockFilter,
	}
}

func NewEventFilter(filters ...TopicFilter) interface{} {
	requestID++
	return &filterRequest{
		ID:     fmt.Sprintf("evt_%d", requestID),
		Method: EthNewFilter,
		Params: filters,
	}
}

func NewFilterChanges(filterID string) interface{} {
	requestID++
	return &filterChangesRequest{
		ID:     fmt.Sprintf("chg_%d", requestID),
		Method: EthGetFilterChanges,
		Params: []string{
			filterID,
		},
	}
}

type TopicFilter struct {
	BlockRange
	Address string   `json:"address,omitempty"`
	Topics  []string `json:"topics,omitempty"`
}

type BlockRange struct {
	From string `json:"fromBlock,omitempty"`
	To   string `json:"toBlock,omitempty"`
}

type filterRequest struct {
	ID     string        `json:"id,omitempty"`
	Method string        `json:"method"`
	Params []TopicFilter `json:"params,omitempty"`
}

type filterChangesRequest struct {
	ID     string   `json:"id,omitempty"`
	Method string   `json:"method"`
	Params []string `json:"params,omitempty"`
}

type filterResult struct {
	ID     string `json:"id,omitempty"`
	Result string `json:"result,omitempty"`
}

type blockResult struct {
	ID     string   `json:"id,omitempty"`
	Result []string `json:"result,omitempty"`
}

type eventResult struct {
	ID     string     `json:"id,omitempty"`
	Result []LogEvent `json:"result,omitempty"`
}
