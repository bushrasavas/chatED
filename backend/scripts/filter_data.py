from datasets import load_dataset
import os

dataset = load_dataset("Amod/mental_health_counseling_conversations", split="train")

filtered_dataset = dataset.filter(
    lambda example: 'eating' in example['context'].lower() or 'eating' in example['response'].lower()
)
# output folder
output_dir = os.path.join("..", "data")
os.makedirs(output_dir, exist_ok=True)

# save as JSON
output_path = os.path.join(output_dir, "filtered_eating_data.json")
filtered_dataset.to_json(output_path)

print(f"Filtered dataset saved to: {output_path}")
print(f"Number of records: {len(filtered_dataset)}")
