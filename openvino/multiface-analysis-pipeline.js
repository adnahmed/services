{
    "model_config_list": [
        {
            "config": {
                "name": "face_detection",
                "base_path": "/workspace/face-detection-retail-0004/",
                "shape": "(1,400,600,3)",
                "layout": "NHWC:NCHW"
            }
        },
        {
            "config": {
                "name": "age_gender_recognition",
                "base_path": "/workspace/age-gender-recognition-retail-0013/",
                "shape": "(1,64,64,3)",
                "layout": "NHWC:NCHW"
            }
        },
        {
            "config": {
                "name": "emotion_recognition",
                "base_path": "/workspace/emotion-recognition-retail-0003/",
                "shape": "(1,64,64,3)",
                "layout": "NHWC:NCHW"
            }
        }
    ],
        "custom_node_library_config_list": [
            {
                "name": "object_detection_image_extractor",
                "base_path":
                    "/workspace/lib/libcustom_node_model_zoo_intel_object_detection.so"
            }
        ],
            "pipeline_config_list": [
                {
                    "name": "find_face_images",
                    "inputs": [
                        "image"
                    ],
                    "nodes": [
                        {
                            "name": "face_detection_node",
                            "model_name": "face_detection",
                            "type": "DL model",
                            "inputs": [
                                {
                                    "data": {
                                        "node_name": "request",
                                        "data_item": "image"
                                    }
                                }],
                            "outputs": [
                                {
                                    "data_item": "detection_out",
                                    "alias": "detection"
                                }]
                        },
                        {
                            "name": "extract_node",
                            "library_name": "object_detection_image_extractor",
                            "type": "custom",
                            "demultiply_count": 0,
                            "params": {
                                "original_image_width": "600",
                                "original_image_height": "400",
                                "target_image_width": "64",
                                "target_image_height": "64",
                                "original_image_layout": "NHWC",
                                "target_image_layout": "NHWC",
                                "convert_to_gray_scale": "false",
                                "max_output_batch": "100",
                                "confidence_threshold": "0.7",
                                "debug": "true",
                                "buffer_queue_size": "24"
                            },
                            "inputs": [
                                {
                                    "image": {
                                        "node_name": "request",
                                        "data_item": "image"
                                    }
                                },
                                {
                                    "detection": {
                                        "node_name": "face_detection_node",
                                        "data_item": "detection"
                                    }
                                }],
                            "outputs": [
                                {
                                    "data_item": "images",
                                    "alias": "face_images"
                                },
                                {
                                    "data_item": "coordinates",
                                    "alias": "face_coordinates"
                                },
                                {
                                    "data_item": "confidences",
                                    "alias": "confidence_levels"
                                }]
                        },
                        {
                            "name": "age_gender_recognition_node",
                            "model_name": "age_gender_recognition",
                            "type": "DL model",
                            "inputs": [
                                {
                                    "data": {
                                        "node_name": "extract_node",
                                        "data_item": "face_images"
                                    }
                                }],
                            "outputs": [
                                {
                                    "data_item": "age_conv3",
                                    "alias": "age"
                                },
                                {
                                    "data_item": "prob",
                                    "alias": "gender"
                                }]
                        },
                        {
                            "name": "emotion_recognition_node",
                            "model_name": "emotion_recognition",
                            "type": "DL model",
                            "inputs": [
                                {
                                    "data": {
                                        "node_name": "extract_node",
                                        "data_item": "face_images"
                                    }
                                }],
                            "outputs": [
                                {
                                    "data_item": "prob_emotion",
                                    "alias": "emotion"
                                }]
                        }
                    ],
                    "outputs": [
                        {
                            "face_images": {
                                "node_name": "extract_node",
                                "data_item": "face_images"
                            }
                        },
                        {
                            "face_coordinates": {
                                "node_name": "extract_node",
                                "data_item": "face_coordinates"
                            }
                        },
                        {
                            "confidence_levels": {
                                "node_name": "extract_node",
                                "data_item": "confidence_levels"
                            }
                        },
                        {
                            "ages": {
                                "node_name": "age_gender_recognition_node",
                                "data_item": "age"
                            }
                        },
                        {
                            "genders": {
                                "node_name": "age_gender_recognition_node",
                                "data_item": "gender"
                            }
                        },
                        {
                            "emotions": {
                                "node_name": "emotion_recognition_node",
                                "data_item": "emotion"
                            }
                        }
                    ]
                }
            ]
}