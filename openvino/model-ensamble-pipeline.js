{
    "model_config_list": [
        {
            "config": {
                "name": "googlenet",
                "base_path": "/models/googlenet-v2-tf"
            }
        },
        {
            "config": {
                "name": "resnet",
                "base_path": "/models/resnet-50-tf"
            }
        },
        {
            "config": {
                "name": "argmax",
                "base_path": "/models/argmax"
            }
        }
    ],
    "pipeline_config_list": [
        {
            "name": "image_classification_pipeline",
            "inputs": ["image"],
            "nodes": [
                {
                    "name": "googlenet_node",
                    "model_name": "googlenet",
                    "type": "DL model",
                    "inputs": [
                        {"input": {"node_name": "request",
                                   "data_item": "image"}}
                    ], 
                    "outputs": [
                        {"data_item": "InceptionV2/Predictions/Softmax",
                         "alias": "probability"}
                    ] 
                },
                {
                    "name": "resnet_node",
                    "model_name": "resnet",
                    "type": "DL model",
                    "inputs": [
                        {"map/TensorArrayStack/TensorArrayGatherV3": {"node_name": "request",
                                                                      "data_item": "image"}}
                    ], 
                    "outputs": [
                        {"data_item": "softmax_tensor",
                         "alias": "probability"}
                    ] 
                },
                {
                    "name": "argmax_node",
                    "model_name": "argmax",
                    "type": "DL model",
                    "inputs": [
                        {"input1": {"node_name": "googlenet_node",
                                    "data_item": "probability"}},
                        {"input2": {"node_name": "resnet_node",
                                    "data_item": "probability"}}
                    ], 
                    "outputs": [
                        {"data_item": "argmax/Squeeze",
                         "alias": "most_probable_label"}
                    ] 
                }
            ],
            "outputs": [
                {"label": {"node_name": "argmax_node",
                           "data_item": "most_probable_label"}}
            ]
        }
    ]
}