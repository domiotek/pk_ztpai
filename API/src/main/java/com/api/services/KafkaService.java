package com.api.services;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.CreateTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.TopicPartition;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class KafkaService<T> {
    private final AdminClient admin;
    private final KafkaTemplate<String, T> kafkaTemplate;
    private final ConsumerFactory<String, T> factory;

    public boolean createTopic(String name) {

        try {
            NewTopic newTopic = new NewTopic(name, 1, (short) 1);

            admin.createTopics(Collections.singleton(newTopic)).all().get();
            return true;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteTopic(String name) {
        try {
            admin.deleteTopics(Collections.singleton(name)).all().get();
            return true;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return false;
        }
    }

    public void sendToTopic(String topicName, T data) {
        kafkaTemplate.send(topicName, data)
                .whenComplete((result, ex) ->{
                    if(ex!=null) System.out.println("Unable to send message due to : " + ex.getMessage());
                    else System.out.println("Message sent");
                });
    }

    public List<T> readXLastMessages(String topicName, Number messageCount) {
        final var result = new ArrayList<T>();

        try (Consumer<String, T> consumer = factory.createConsumer()) {
            TopicPartition topicPartition = new TopicPartition(topicName, 0);

            consumer.assign(Collections.singletonList(topicPartition));

            var endOffset = consumer.endOffsets(Collections.singletonList(topicPartition)).get(topicPartition);

            consumer.seek(topicPartition, Math.max(endOffset - messageCount.longValue(), 0));

            ConsumerRecords<String, T> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, T> record : records) {
                result.add(record.value());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return result;
    }

}
