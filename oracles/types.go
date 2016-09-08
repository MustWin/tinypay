package oracles

type req struct {
	ID     string      `json:"id,omitempty"`
	Method string      `json:"method"`
	Params interface{} `json:"params,omitempty"`
}

type res struct {
	ID     string      `json:"id,omitempty"`
	Result interface{} `json:"result,omitempty"`
}
